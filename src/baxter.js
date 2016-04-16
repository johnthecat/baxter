import EventService from './services/event';
import BaxterError from './entities/error';
import ObservableArray from './entities/array';
import Stack from './entities/stack';

/**
 * @description Map of lib errors
 * @type {Object.<String>}
 */
const ERROR = {
    MUST_BE_DEFINED: `variables must be defined`,
    NO_SETTER_TO_COMPUTED: `you can't set value to computed variable`,
    PLUGIN_NAME_RESERVED: (plugin) => `name ${plugin} is already reserved. Try to rename your plugin`,
    WRONG_EVENT: (eventType) => `listening ${eventType} event is not accepted`,
    IS_NOT_A_STRING: (variable) => `variable must be a string: ${typeof variable} ${variable}`,
    IS_NOT_A_FUNCTION: (variable) => `variable must be a function: ${typeof variable} ${variable}`,
    IS_NOT_AN_OBJECT: (variable) => `variable must be an object: ${typeof variable} ${variable}`
};

/**
 * @description List of reserved names
 * @type {Array.<String>}
 */
const EXPECTED_NAMES = [
    '_stack',
    '_variables',
    '_watchers',
    'eventStream',
    'utils',
    'plugin',
    'createClosure',
    'subscribeEvent',
    'subscribe',
    'postEvent',
    'resolve',
    'getDependencies',
    'addToStack',
    'variable',
    'computed',
    'watch',
    'dispose'
];

/**
 * @description Field name for object uid
 * @type {String}
 */
const UID_FIELD = '__uid__';

/**
 * @description Basic unique id, other uids are incremented from this
 * @type {Number}
 */
let uid = 1;


/**
 * @class Baxter
 * @description Main class, provides library as it self.
 */
class Baxter {
    /**
     * @param {EventService} EventService
     */
    constructor(EventService) {
        /**
         * @name Baxter#_stack
         * @type {Stack}
         * @private
         * @description Callstack is a map if promises, that Baxter must resolve.
         */
        this._stack = new Stack();

        /**
         * @name Baxter#_variables
         * @type {Map.<Set>}
         * @private
         * @description handles all subscriptions for property object disposing
         */
        this._variables = new Map();

        /**
         * @name Baxter#eventStream
         * @type {EventService}
         * @description Provides events service
         */
        this.eventStream = new EventService(this);

        /**
         * @name Baxter#utils
         * @type {Object}
         */
        this.utils = {
            /**
             * @name Baxter#utils.createObjectUID
             * @param {Object} object
             * @returns {Number}
             */
            createObjectUID: (object) => {
                let currentUID = uid++;

                Object.defineProperty(object, UID_FIELD, {
                    enumerable: false,
                    value: currentUID
                });

                return currentUID;
            },

            /**
             * @name Baxter#utils.getUIDByObject
             * @param {Object} object
             * @returns {*}
             */
            getUIDByObject: (object) => {
                if (!object[UID_FIELD]) {
                    return this.utils.createObjectUID(object);
                }

                return object[UID_FIELD];
            },

            /**
             * @name Baxter#utils.createKeyUID
             * @param {Object} owner
             * @param {String} key
             * @returns {String}
             */
            createKeyUID: (owner, key) => {
                return this.utils.getUIDByObject(owner) + ':' + key;
            }
        };

        /**
         * @name Baxter#_watchers
         * @type {Object}
         * @private
         */
        this._watchers = {
            variable: {
                get: (config) => {
                    let value = config.getValue();

                    this.postEvent('get', {
                        uid: config.uid,
                        owner: config.owner,
                        key: config.key,
                        value: value
                    });
                    return value;
                },

                set: (config, newValue) => {
                    let oldValue = config.getValue();

                    if (newValue === oldValue) {
                        return false;
                    }

                    this.postEvent('will-change', {
                        uid: config.uid,
                        type: 'variable'
                    });

                    config.setValue(newValue);

                    this.postEvent('will-change-all');
                    this.postEvent('update', {
                        uid: config.uid,
                        owner: config.owner,
                        key: config.key,
                        value: newValue,
                        oldValue: oldValue
                    });
                }
            },

            computed: {
                get: (config) => {
                    let value = config.getValue();

                    this.postEvent('get', {
                        uid: config.uid,
                        owner: config.owner,
                        key: config.key,
                        value: value
                    });

                    return value;
                },

                set: (config, computedResult) => {
                    let oldValue = config.getValue();

                    if (!config.isComputing()) {
                        throw new BaxterError(ERROR.NO_SETTER_TO_COMPUTED);
                    }

                    if (computedResult === oldValue) {
                        return false;
                    }

                    config.setIsComputing(false);
                    config.setValue(computedResult);


                    this.postEvent('update', {
                        uid: config.uid,
                        owner: config.owner,
                        key: config.key,
                        value: computedResult,
                        oldValue: oldValue
                    });
                }
            }
        };
    }

    /**
     * @name Baxter#plugin
     * @param {String} namespace
     * @param {*} plugin
     */
    plugin(namespace, plugin) {
        if (EXPECTED_NAMES.indexOf(namespace) !== -1) {
            throw new BaxterError(ERROR.PLUGIN_NAME_RESERVED(namespace));
        }

        return this[namespace] = plugin;
    }

    /**
     * @name Baxter#createClosure
     * @param {Function} func
     * @param {*} config
     * @returns {Function}
     */
    createClosure(func, config) {
        return (data) => func(config, data);
    }

    /**
     * @name Baxter#subscribeEvent
     * @param {String} eventType
     * @param {Function} subscriber
     * @param {Boolean} [once=false]
     */
    subscribeEvent(eventType, subscriber, once = false) {
        if (typeof eventType !== 'string') {
            throw new BaxterError(ERROR.IS_NOT_A_STRING(eventType));
        }

        if (typeof subscriber !== 'function') {
            throw new BaxterError(ERROR.IS_NOT_A_FUNCTION(subscriber));
        }

        if (once) {
            this.eventStream.once(eventType, subscriber);
        } else {
            this.eventStream.on(eventType, subscriber);

            return {
                dispose: () => this.eventStream.off(eventType, subscriber)
            };
        }
    }

    /**
     * @name Baxter#postEvent
     * @param {String} eventType
     * @param {*} [data]
     */
    postEvent(eventType, data) {
        if (typeof eventType !== 'string') {
            throw new BaxterError(ERROR.IS_NOT_A_STRING(eventType));
        }

        this.eventStream.post(eventType, data);
    }

    /**
     * @name Baxter#subscribe
     * @param {Object} owner
     * @param {String} key
     * @param {Function} subscriber
     * @param {String} [eventType]
     * @param {Boolean} [once]
     * @throws {BaxterError}
     */
    subscribe(owner, key, subscriber, eventType = 'update', once = false) {
        if (!owner || !key || !subscriber) {
            throw new BaxterError(ERROR.MUST_BE_DEFINED);
        }
        let uid = this.utils.createKeyUID(owner, key);
        let availableEvents = ['will-change', 'update'];
        let eventToListen = availableEvents.indexOf(eventType) !== -1 && eventType;
        let eventHandler = (config) => {
            if (config.uid === uid) {
                subscriber(config);
            }
        };

        if (!eventToListen) {
            throw new BaxterError(ERROR.WRONG_EVENT(eventType));
        }

        return this.subscribeEvent(eventToListen, eventHandler, once);
    }

    /**
     * @name Baxter#resolve
     * @param {Set} dependencies
     * @returns {Promise}
     */
    resolve(dependencies) {
        let dependenciesArray = Array.from(dependencies);

        return Promise.all(this._stack.getDependencies(dependenciesArray));
    }

    /**
     * @name Baxter#getDependencies
     * @param {Object} context
     * @param {Function} computed
     * @param {Function} callback
     * @returns {*} Result of computing
     */
    getDependencies(context, computed, callback) {
        if (!context || !computed || !callback) {
            throw new BaxterError(ERROR.MUST_BE_DEFINED);
        }

        let listener = this.subscribeEvent('get', callback);
        let computingResult = computed.call(context);

        listener.dispose();

        return computingResult;
    }

    /**
     * @name Baxter#addToStack
     * @param {Object} owner
     * @param {String} key
     * @param {Function|Promise} callback
     * @param {Boolean} [async=false]
     */
    addToStack(owner, key, callback, async = false) {
        let uid = this.utils.createKeyUID(owner, key);
        let promise;

        this.postEvent('will-change', {
            uid: uid,
            type: 'computed'
        });

        if (async) {
            promise = callback;
        } else {
            promise = new Promise((resolve) => {
                this.subscribeEvent('will-change-all', () => {
                    resolve(callback());
                }, true);
            });
        }

        this._stack.add(uid, promise.then(() => {
            this._stack.delete(uid);
            if (!this._stack.size) {
                this.postEvent('change-complete');
            }
        }));
    }

    /**
     * @name Baxter#variable
     * @param {Object} owner
     * @param {String} key
     * @param {*} [initialValue]
     * @returns {*} initialValue
     */
    variable(owner, key, initialValue) {
        if (typeof owner !== 'object') {
            throw new BaxterError(ERROR.IS_NOT_AN_OBJECT(owner));
        }
        if (typeof key !== 'string') {
            throw new BaxterError(ERROR.IS_NOT_A_STRING(key));
        }

        let uid = this.utils.createKeyUID(owner, key);

        if (this._variables.has(uid)) {
            return initialValue;
        }

        let value = initialValue;
        let closure = {
            uid: uid,
            owner: owner,
            key: key,
            getValue: () => value,
            setValue: (newValue) => value = newValue
        };

        this._variables.set(uid, new Set());

        Object.defineProperty(owner, key,
            {
                configurable: true,
                get: this.createClosure(this._watchers.variable.get, closure),
                set: this.createClosure(this._watchers.variable.set, closure)
            }
        );

        return value;
    }

    /**
     * @name Baxter#computed
     * @param {Object} owner
     * @param {String} key
     * @param {Function} computedObservable
     * @param {Set|Map|Array} [userDependencies]
     * @returns {*}
     */
    computed(owner, key, computedObservable, userDependencies) {
        if (typeof owner !== 'object') {
            throw new BaxterError(ERROR.IS_NOT_AN_OBJECT(owner));
        }

        if (typeof key !== 'string') {
            throw new BaxterError(ERROR.IS_NOT_A_STRING(key));
        }

        if (typeof computedObservable !== 'function') {
            throw new BaxterError(ERROR.IS_NOT_A_FUNCTION(computedObservable));
        }

        let uid = this.utils.createKeyUID(owner, key);

        if (this._variables.has(uid)) {
            return computedObservable;
        }

        let latestValue;
        let isComputing = false;
        let dependencies = new Set();
        let handlers = new Set();
        let closure = {
            uid: uid,
            owner: owner,
            key: key,
            setValue: (newValue) => latestValue = newValue,
            getValue: () => latestValue,
            isComputing: () => isComputing,
            setIsComputing: (value) => isComputing = value
        };

        this._variables.set(uid, handlers);

        Object.defineProperty(owner, key, {
            configurable: true,
            get: this.createClosure(this._watchers.computed.get, closure),
            set: this.createClosure(this._watchers.computed.set, closure)
        });

        let handleObservable = (handledValue) => {
            dependencies.add(handledValue.uid);

            let subscriber = this.subscribe(handledValue.owner, handledValue.key, () => {
                /**
                 * FIXME: bug, after batch of changed isComputing stays true.
                 */
                if (isComputing) {
                    return false;
                }

                isComputing = true;

                this.addToStack(owner, key, () => this.resolve(dependencies)
                    .then(() => computedObservable.call(owner))
                    .then((value) => {
                        owner[key] = value;
                    })
                    .catch(() => {
                        owner[key] = undefined;
                    })
                );
            }, 'will-change');

            handlers.add(subscriber);
        };

        if (userDependencies) {
            for (let userDependency in userDependencies) {
                if (!userDependencies.hasOwnProperty(userDependency)) {
                    continue;
                }

                handleObservable(userDependency);
            }
        }

        let calculatedValue = this.getDependencies(owner, computedObservable, handleObservable);
        if (calculatedValue instanceof Promise) {
            this.addToStack(
                owner,
                key,
                calculatedValue.then((result) => {
                    isComputing = true;
                    owner[key] = result;
                }),
                true
            );
        } else {
            isComputing = true;
            owner[key] = calculatedValue;
        }

        return latestValue;
    }

    /**
     * @name Baxter#array
     * @param {Object} owner
     * @param {String} key
     * @param {Array} initialArray
     */
    array(owner, key, initialArray) {
        let uid = this.utils.createKeyUID(owner, key);

        owner[key] = new ObservableArray(uid, owner, key, this.eventStream, initialArray);
    }

    /**
     * @name Baxter#watch
     * @param {Object} object
     */
    watch(object) {
        if (typeof object !== 'object') {
            throw new BaxterError(ERROR.IS_NOT_AN_OBJECT(object));
        }

        let computedVariables = [];

        for (let key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }

            let value = object[key];

            if (typeof value === 'function') {
                computedVariables.push({
                    owner: object,
                    key: key,
                    value: value
                });
            } else if (value instanceof Array) {
                this.array(object, key, value);
            } else {
                this.variable(object, key, value);
            }
        }

        for (let index = 0, computedLength = computedVariables.length; index < computedLength; index++) {
            let computed = computedVariables[index];
            this.computed(computed.owner, computed.key, computed.value);
        }

        return object;
    }

    /**
     * @name Baxter#dispose
     * @param {Object} owner
     * @param {String} [key]
     */
    dispose(owner, key) {
        if (typeof owner !== 'object') {
            throw new BaxterError(ERROR.IS_NOT_AN_OBJECT(owner));
        }

        if (!key) {
            let ownerKeys = Object.keys(owner);
            let ownerKeyIndex = 0,
                field, uid, handlers,
                handlersArray, handlerIndex;

            for (ownerKeyIndex; ownerKeyIndex < ownerKeys.length; ownerKeyIndex++) {
                field = ownerKeys[ownerKeyIndex];

                uid = this.utils.createKeyUID(owner, field);
                handlers = this._variables.get(uid);

                if (!handlers) {
                    continue;
                }

                handlersArray = Array.from(handlers);
                handlerIndex = 0;

                for (handlerIndex; handlerIndex < handlersArray.length; handlerIndex++) {
                    handlersArray[handlerIndex].dispose();
                    delete owner[field];
                }

                this._variables.delete(uid);
            }
        } else {
            let uid = this.utils.createKeyUID(owner, key);
            let handlers = this._variables.get(uid);

            if (!handlers) {
                return;
            }

            let handlersArray = Array.from(handlers);
            let index = 0;

            for (index; index < handlersArray.length; index++) {
                handlersArray[index].dispose();
                delete owner[key];
            }

            this._variables.delete(uid);
        }
    }
}

export default new Baxter(EventService);
