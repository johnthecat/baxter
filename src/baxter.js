import EventService from './services/event';
import LibraryError from './entities/error';

/**
 * TODO: clear event service stack
 * TODO: handle exceptions inside computed
 * TODO: add array tracking
 * TODO: clear code
 * TODO: documentation
 * TODO: unit-tests
 * TODO: performance tests
 * TODO: plugin handler
 * TODO: simple template engine as plugin (like in knockout.js)
 */


class ObservableArray extends Array {
    constructor(eventService, values) {
        super();
        Object.assign(this, values);
        this.length = values.length;
        this.eventStream = eventService;
    }

    push(value) {
        let index = super.push(value);

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'push',
            changed: this[index]
        });

        return index;
    }

    shift() {
        let deletedValue = super.shift();

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'shift',
            changed: deletedValue
        });

        return deletedValue;
    }

    pop() {
        let lastValue = super.pop();

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'pop',
            changed: lastValue
        });

        return lastValue;
    }

    unshift(...values) {
        let mergedArray = super.unshift.apply(this, values);

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'unshift',
            changed: values
        });

        return mergedArray;
    }

    reverse() {
        let reversedArray = super.reverse();

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'reverse',
            changed: reversedArray
        });

        return reversedArray;
    }

    sort(sortFunction) {
        let sortedArray = super.sort(sortFunction);

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'sort',
            changed: sortedArray
        });

        return sortedArray;
    }

    splice(...arguments) {
        let splicedArray = super.splice.apply(this, arguments);

        this.eventStream.post('update', {
            uid: uid,
            owner: owner,
            key: key,
            value: this,
            type: 'splice',
            changed: splicedArray
        });

        return splicedArray;
    }
}


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
            createObjectUID: (object) => {
                let uid = UID++;

                Object.defineProperty(object, '__uid__', {
                    enumerable: false,
                    value: uid
                });

                return uid;
            },

            getUIDByObject: (object) => {
                if (!object['__uid__']) {
                    return this.utils.createObjectUID(object);
                }

                return object['__uid__']
            },

            createKeyUID: (owner, key) => {
                return this.utils.getUIDByObject(owner) + ':' + key;
            }
        };

        function debounce(func, wait) {
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

        let handler = debounce(() => {
            this.eventStream.post('will-change-all');
        }, 20);

        this.eventStream.on('will-change', handler);
    }

    /**
     * @name Baxter.subscribe
     * @param {Object} owner
     * @param {String} key
     * @param {Function} subscriber
     * @throws {LibraryError}
     */
    subscribe(owner, key, subscriber) {
        if (!owner || !key || !subscriber) {
            throw new LibraryError('can\'t subscribe variable without owner, key or callback function.');
        }
        let uid = this.utils.createKeyUID(owner, key);

        this.eventStream.on('update', (config) => {
            if (config.uid === uid) {
                subscriber(config.value, config.oldValue);
            }
        });
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
     * @returns {*}
     */
    getDependencies(computed, callback) {
        this.eventStream.on('get', callback);
        let computingResult = computed();
        this.eventStream.off('get', callback);

        return computingResult;
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
                this.eventStream.post('change-complete');
            }
            resolve();
        };

        this.eventStream.post('will-change', {
            uid: uid,
            owner: owner,
            key: key
        });

        this.callstack.set(uid, new Promise((resolve) => {
            /**
             * When will change chain is complete, then resolve
             */
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

        this.eventStream.post('registered', {
            uid: uid,
            owner: owner,
            key: key
        });

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
        let dependencies = new Set();
        let handleObservable = (handledValue) => {
            if (handledValue.uid === computedUID) {
                throw new LibraryError('Circular dependencies detected on ' + key + ' value.');
            }

            dependencies.add(this.utils.createKeyUID(handledValue.owner, handledValue.key));

            /**
             * Event listen: One of dependency will resolve later
             */
            this.eventStream.on('will-change', (willChange) => {
                /**
                 * Don't change anything if value if not current handled or variable is computing now
                 */
                if (willChange.uid !== handledValue.uid || isComputing) {
                    return false;
                }

                /**
                 * Add resolve to global stack
                 */
                this.addToStack(owner, key, () => {
                    return this.resolve(dependencies)
                        .then(() => {
                            oldValue = value;
                            value = computedObservable.call(owner);

                            return value;
                        })
                        .then((value) => {
                            isComputing = false;

                            if (oldValue === value) {
                                return false;
                            }

                            this.eventStream.post('update', {
                                uid: computedUID,
                                owner: owner,
                                key: key,
                                value: value,
                                oldValue: oldValue
                            });
                        });
                });

                isComputing = true;
            });
        };

        if (Symbol.iterator in Object(userDependencies)) {
            for (let userDependency of userDependencies) {
                handleObservable(userDependency);
            }
        }

        value = this.getDependencies(computedObservable, handleObservable);

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
            set: (value) => {
                if (value === value) {
                    return;
                }
                throw new LibraryError('you can\'t set value to computed');
            }
        });

        return value;
    }

    array(owner, key, initialValues) {
        let uid = this.utils.createKeyUID(owner, key);

        //TODO: track dependencies

        let observableArray = new ObservableArray(this.eventStream, initialValues);

        owner[key] = observableArray;

        Object.defineProperty(owner, key, {
            configurable: true,
            get: () => {
                return observableArray;
            },
            set: (value) => {
                baxter.eventStream.post('update', {
                    uid: uid,
                    owner: owner,
                    key: key,
                    value: value
                });

                return value;
            }
        });

        return observableArray;
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

            } else if (Object.prototype.toString.call(value) === '[object Array]') {
                this.array(object, key, value);
            } else {
                this.observable(object, key, value);
            }
        }

        return object;
    }
}

export default Baxter;
