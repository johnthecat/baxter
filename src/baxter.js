import EventService from './services/event';
import BaxterError from './entities/error';
import ObservableArray from './entities/array';

/**
 * @class Baxter
 * @description Main class, provides library as it self.
 */
class Baxter {
    constructor() {
        /**
         * @description Basic unique id, other uids are incremented from this
         * @type {number}
         */
        let UID = 1;

        /**
         * @name Baxter._callstack
         * @type {Map}
         */
        this._callstack = new Map();

        /**
         * @name Baxter._variables
         * @type {Map}
         */
        this._variables = new Map();

        /**
         * @name Baxter.eventStream
         * @type {EventService}
         * @description Provides events service
         */
        this.eventStream = new EventService(this);

        /**
         * @name Baxter.utils
         * @type {Object}
         */
        this.utils = {
            /**
             * @name Baxter.utils.createObjectUID
             * @param object
             * @returns {number}
             */
            createObjectUID: (object) => {
                let uid = UID++;

                Object.defineProperty(object, '__uid__', {
                    enumerable: false,
                    value: uid
                });

                return uid;
            },

            /**
             * @name Baxter.utils.getUIDByObject
             * @param object
             * @returns {*}
             */
            getUIDByObject: (object) => {
                if (!object['__uid__']) {
                    return this.utils.createObjectUID(object);
                }

                return object['__uid__'];
            },

            /**
             * @name Baxter.utils.createKeyUID
             * @param owner
             * @param key
             * @returns {string}
             */
            createKeyUID: (owner, key) => {
                return this.utils.getUIDByObject(owner) + ':' + key;
            }
        };

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

                    this.postEvent('update',
                        {
                            uid: config.uid,
                            owner: config.owner,
                            key: config.key,
                            value: newValue,
                            oldValue: oldValue
                        }
                    );
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
                        throw new BaxterError('you can\'t set value to computed');
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
     * @name Baxter.plugin
     * @param {String} namespace
     * @param {*} plugin
     */
    plugin(namespace, plugin) {
        let exceptedNames = [
            '_callstack',
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

        if (exceptedNames.indexOf(namespace) !== -1) {
            throw new BaxterError('plugin: name of your plugin is already reserved. Try to rename your plugin');
        }

        return this[namespace] = plugin;
    }

    /**
     * @name Baxter.createClosure
     * @param {Function} func
     * @param {*} config
     * @returns {Function}
     */
    createClosure(func, config) {
        return (data) => {
            return func(config, data);
        }
    }

    /**
     * @name Baxter.subscribeEvent
     * @param {String} eventType
     * @param {Function} subscriber
     * @param {Boolean} [once]
     */
    subscribeEvent(eventType, subscriber, once = false) {
        if (typeof eventType !== 'string') {
            throw new BaxterError('subscribeEvent: eventType is not defined.');
        }

        if (typeof subscriber !== 'function') {
            throw new BaxterError('subscribeEvent: subscriber function is not defined.');
        }

        if (once) {
            this.eventStream.once(eventType, subscriber);
        } else {
            this.eventStream.on(eventType, subscriber);

            return {
                dispose: () => this.eventStream.off(eventType, subscriber)
            }
        }
    }

    /**
     * @name Baxter.postEvent
     * @param {String} eventType
     * @param {*} [data]
     */
    postEvent(eventType, data) {
        if (typeof eventType !== 'string') {
            throw new BaxterError('postEvent: eventType is not defined.');
        }

        this.eventStream.post(eventType, data);
    }

    /**
     * @name Baxter.subscribe
     * @param {Object} owner
     * @param {String} key
     * @param {Function} subscriber
     * @param {String} [eventType]
     * @param {Boolean} [once]
     * @throws {BaxterError}
     */
    subscribe(owner, key, subscriber, eventType = 'update', once = false) {
        if (!owner || !key || !subscriber) {
            throw new BaxterError('subscribe: can\'t subscribe variable without owner, key or callback function.');
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
            throw new BaxterError('subscribe: listening ' + eventType + ' event is not accepted.');
        }

        return this.subscribeEvent(eventToListen, eventHandler, once);
    }

    /**
     * @name Baxter.resolve
     * @param {Set} dependencies
     * @returns {Promise}
     */
    resolve(dependencies) {
        let result = new Set();
        let dependenciesArray = Array.from(dependencies);
        let index = 0;
        let dependency;

        for (index; index < dependenciesArray.length; index++) {
            dependency = dependenciesArray[index];

            result.add(this._callstack.get(dependency));
        }

        return Promise.all(result);
    }

    /**
     * @name Baxter.getDependencies
     * @param {Object} context
     * @param {Function} computed
     * @param {Function} callback
     * @returns {*} Result of computing
     */
    getDependencies(context, computed, callback) {
        if (!context || !computed || !callback) {
            throw new BaxterError('getDependencies: there is no context, computed function or callback.');
        }

        let listener = this.subscribeEvent('get', callback);
        let computingResult = computed.call(context);

        listener.dispose();

        return computingResult;
    }

    /**
     * @name Baxter.addToStack
     * @param {Object} owner
     * @param {String} key
     * @param {Function} callback
     * @param {Boolean} async
     */
    addToStack(owner, key, callback, async = false) {
        let uid = this.utils.createKeyUID(owner, key);

        this.postEvent('will-change', {
            uid: uid,
            type: 'computed'
        });

        let promise = async ? callback : new Promise((resolve) => {
            this.subscribeEvent('will-change-all', () => {
                resolve(callback());
            }, true);
        });

        this._callstack.set(uid, promise.then(() => {
            this._callstack.delete(uid);
            if (!this._callstack.size) {
                this.postEvent('change-complete');
            }
        }));
    }

    /**
     * @name Baxter.variable
     * @param {Object} owner
     * @param {String} key
     * @param {*} [initialValue]
     * @returns {*} initialValue
     */
    variable(owner, key, initialValue) {
        if (typeof owner !== 'object') {
            throw new BaxterError('variable: owner object in not defined.');
        }
        if (typeof key !== 'string') {
            throw new BaxterError('variable: key string in not defined.');
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
     * @name Baxter.computed
     * @param {Object} owner
     * @param {String} key
     * @param {Function} computedObservable
     * @param {Set|Map|Array} [userDependencies]
     * @returns {*}
     */
    computed(owner, key, computedObservable, userDependencies) {
        if (typeof owner !== 'object') {
            throw new BaxterError('computed: owner object in not defined.');
        }

        if (typeof key !== 'string') {
            throw new BaxterError('computed: key string in not defined.');
        }

        if (typeof computedObservable !== 'function') {
            throw new BaxterError('computed: computedObservable function in not defined.');
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
                calculatedValue
                    .then((result) => {
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
     * @name Baxter.array
     * @param {Object} owner
     * @param {String} key
     * @param {Array} initialArray
     */
    array(owner, key, initialArray) {
        let uid = this.utils.createKeyUID(owner, key);

        owner[key] = new ObservableArray(uid, owner, key, this.eventStream, initialArray);
    }

    /**
     * @name Baxter.watch
     * @param {Object} object
     */
    watch(object) {
        if (typeof object !== 'object') {
            throw new BaxterError('watch: object is not defined.');
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
     * @name Baxter.dispose
     * @param {Object} owner
     * @param {String} [key]
     */
    dispose(owner, key) {
        if (typeof owner !== 'object') {
            throw new BaxterError('Dispose: object is not defined.');
        }

        if (!key) {
            for (let field of (Object.keys(owner))) {
                let uid = this.utils.createKeyUID(owner, field);
                let handlers = this._variables.get(uid);

                if (!handlers) {
                    continue;
                }

                for (let handler of handlers) {
                    handler.dispose();
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

            for (let handler of handlers) {
                handler.dispose();
                delete owner[key];
            }

            this._variables.delete(uid);
        }
    }
}

export default new Baxter();
