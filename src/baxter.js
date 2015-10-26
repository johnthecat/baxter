import EventService from './services/event';
import LibraryError from './entities/error';

/**
 * TODO: add array tracking
 * TODO: clear code
 * TODO: documentation
 * TODO: unit-tests
 * TODO: performance tests
 * TODO: plugin handler
 * TODO: simple template engine as plugin (like in knockout.js)
 */

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
         * @name Baxter.callstack
         * @type {Map}
         */
        this.callstack = new Map();

        /**
         * @name Baxter.variables
         * @type {Map}
         */
        this.variables = new Map();

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

                return object['__uid__']
            },

            /**
             * @name Baxter.utils.createKeyUID
             * @param owner
             * @param key
             * @returns {string}
             */
            createKeyUID: (owner, key) => {
                return this.utils.getUIDByObject(owner) + ':' + key;
            },

            /**
             * @name Baxter.utils.debounce
             * @param {Function} func
             * @param {Number} wait
             * @returns {Function} debounced function
             */
            debounce: (func, wait) => {
                var timeout;
                return () => {
                    let later = () => {
                        func();
                        timeout = null;
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
        };

        this.subscribeEvent('will-change', this.utils.debounce(() => this.postEvent('will-change-all'), 20));
    }

    /**
     * @name Baxter.dispose
     * @param owner
     * @param key
     */
    dispose(owner, key) {
        if (!key) {
            for (let field of (Object.keys(owner))) {
                let uid = this.utils.createKeyUID(owner, field);
                let handlers = this.variables.get(uid);

                if (!handlers) {
                    continue;
                }

                for (let handler of handlers) {
                    handler.dispose();
                    delete owner[field];
                }

                this.variables.delete(uid);
            }
        } else {
            let uid = this.utils.createKeyUID(owner, key);
            let handlers = this.variables.get(uid);

            if (!handlers) {
                return;
            }

            for (let handler of handlers) {
                handler.dispose();
                delete owner[key];
            }

            this.variables.delete(uid);
        }
    }

    /**
     * @name Baxter.subscribeEvent
     * @param {String} eventType
     * @param {Function} subscriber
     * @param {Boolean} [once]
     */
    subscribeEvent(eventType, subscriber, once = false) {
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
        this.eventStream.post(eventType, data);
    }

    /**
     * @name Baxter.subscribe
     * @param {Object} owner
     * @param {String} key
     * @param {Function} subscriber
     * @param {String} [eventType]
     * @param {Boolean} [once]
     * @throws {LibraryError}
     */
    subscribe(owner, key, subscriber, eventType = 'update', once = false) {
        if (!owner || !key || !subscriber) {
            throw new LibraryError('can\'t subscribe variable without owner, key or callback function.');
        }
        let uid = this.utils.createKeyUID(owner, key);
        let availableEvents = ['will-change', 'update'];
        let eventToListen = availableEvents.indexOf(eventType) !== -1 && eventType;
        let eventHandler = (config) => {
            if (config.uid === uid) {
                subscriber(config.value, config.oldValue);
            }
        };

        if (!eventToListen) {
            throw new LibraryError('subscribe: listening ' + eventType + ' event is not accepted.');
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

        for (let dependency of dependencies) {
            result.add(this.callstack.get(dependency));
        }

        return Promise.all(result);
    }

    /**
     * @name Baxter.getDependencies
     * @param {Function} computed
     * @param {Function} callback
     * @returns {Promise}
     */
    getDependencies(computed, callback) {
        let listener = this.subscribeEvent('get', callback);
        let computingResult = computed();

        listener.dispose();

        return new Promise((resolve) => {
            resolve(computingResult);
        }).then((result) => result);
    }

    /**
     * @name Baxter.addToStack
     * @param {Object} owner
     * @param {String} key
     * @param {Function} callback
     */
    addToStack(owner, key, callback) {
        let uid = this.utils.createKeyUID(owner, key);
        let handler = (resolve) => {
            this.callstack.delete(uid);
            if (!this.callstack.size) {
                this.postEvent('change-complete');
            }
            resolve();
        };

        this.postEvent('will-change', {
            uid: uid,
            owner: owner,
            key: key
        });

        this.callstack.set(uid, new Promise((resolve) => {
            /**
             * When will change chain is complete, then resolve
             */
            this.
            this.eventStream.once('will-change-all', () => {
                let resolveResult = callback();
                if (resolveResult instanceof Promise) {
                    resolveResult.then(() => {
                        handler(resolve);
                    });
                } else {
                    handler(resolve);
                }
            });
        }));
    }

    /**
     * @name Baxter.observable
     * @param {Object} owner
     * @param {String} key
     * @param {*} initialValue
     * @returns {*} value
     */
    observable(owner, key, initialValue) {
        let value = initialValue;
        let uid = this.utils.createKeyUID(owner, key);

        Object.defineProperty(owner, key,
            {
                configurable: true,
                set: (newValue) => {
                    if (newValue === value) {
                        return false;
                    }

                    this.addToStack(owner, key, () => {
                        let oldValue = value;

                        value = newValue;

                        this.eventStream.post('update',
                            {
                                uid: uid,
                                owner: owner,
                                key: key,
                                value: value,
                                oldValue: oldValue
                            }
                        );
                    });
                },

                get: () => {
                    this.eventStream.post('get',
                        {
                            uid: uid,
                            owner: owner,
                            key: key,
                            value: value
                        }
                    );
                    return value;
                }
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
        let value;
        let oldValue;
        let isComputing = false;
        let computedUID = this.utils.createKeyUID(owner, key);
        let canUpdate = false;
        let dependencies = new Set();
        let handlers = new Set();

        this.variables.set(computedUID, handlers);

        Object.defineProperty(owner, key, {
            configurable: true,
            get: () => {
                this.eventStream.post('get', {
                    uid: computedUID,
                    owner: owner,
                    key: key,
                    value: value
                });

                return value;
            },
            set: (computedValue) => {
                if (!canUpdate) {
                    throw new LibraryError('you can\'t set value to computed');
                }
                canUpdate = false;
                value = computedValue;

                if (value === oldValue) {
                    return false;
                }

                this.eventStream.post('update', {
                    uid: computedUID,
                    owner: owner,
                    key: key,
                    value: value,
                    oldValue: oldValue
                });
            }
        });

        let handleObservable = (handledValue) => {
            if (handledValue.uid === computedUID) {
                throw new LibraryError('Circular dependencies detected on ' + key + ' value.');
            }

            dependencies.add(this.utils.createKeyUID(handledValue.owner, handledValue.key));

            let subscriber = this.subscribe(handledValue.owner, handledValue.key, () => {
                if (isComputing) {
                    return false;
                }

                this.addToStack(owner, key, () => {
                    return this.resolve(dependencies)
                        .then(() => {
                            oldValue = value;
                            return computedObservable.call(owner);
                        })
                        .then((value) => {
                            isComputing = false;
                            canUpdate = true;
                            owner[key] = value;
                        })
                        .catch(() => {
                            isComputing = false;
                            canUpdate = true;
                            owner[key] = undefined;
                        });
                });

                isComputing = true;
            }, 'will-change');

            handlers.add(subscriber);
        };

        if (Symbol.iterator in Object(userDependencies)) {
            for (let userDependency of userDependencies) {
                handleObservable(userDependency);
            }
        }

        this.getDependencies(computedObservable, handleObservable)
            .then((resolvedValue) => {
                this.addToStack(owner, key, () => {
                    return this.resolve(dependencies)
                        .then(() => {
                            canUpdate = true;
                            owner[key] = resolvedValue;
                        });
                });
            });

        return value;
    }

    /**
     * @name Baxter.watch
     * @param {Object} object
     */
    watch(object) {
        for (let key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }

            let value = object[key];
            if (typeof value === 'function') {
                this.computed(object, key, value);

            } else {
                this.observable(object, key, value);
            }
        }

        return object;
    }
}

export default new Baxter();
