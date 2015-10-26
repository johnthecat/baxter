/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _baxter = __webpack_require__(1);

	var _baxter2 = _interopRequireDefault(_baxter);

	(function (name, constructor, browserContext) {
	    var lib = new constructor();

	    if (browserContext) {
	        browserContext[name] = lib;
	    } else if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = lib;
	        }
	        exports[name] = lib;
	    }

	    //TODO delete

	    var Test = function Test() {
	        var _this = this;

	        _classCallCheck(this, Test);

	        this.id = 1;

	        this.name = 'Tom';
	        this.surname = 'Jarvis';

	        this.fullName = function () {
	            return _this.name + ' ' + _this.surname;
	        };

	        this.array = [1, 2, 3, 4, 5, 6, 7, 8];
	    };

	    function scope() {
	        var test = new Test();

	        lib.watch(test);
	        lib.dispose(test);
	    }

	    function bench(times) {
	        if (!times) {

	            return;
	        }

	        for (var i = 0; i < 1000; i++) {
	            scope();
	        }

	        bench(--times);
	    }

	    function perf() {
	        var times = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];

	        var t0 = performance.now();
	        bench(times);
	        var t1 = performance.now();
	        console.log("Perf for " + times + ': ' + (t1 - t0) + " milliseconds.");
	    }

	    browserContext['perf'] = perf;
	    //browserContext['test'] = lib.watch(new Test());

	    //lib.eventStream.on('update', (changes) => console.log('update', changes.uid, ': ', changes.value));
	})('baxter', _baxter2['default'], window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _servicesEvent = __webpack_require__(2);

	var _servicesEvent2 = _interopRequireDefault(_servicesEvent);

	var _entitiesError = __webpack_require__(3);

	var _entitiesError2 = _interopRequireDefault(_entitiesError);

	var _entitiesArray = __webpack_require__(4);

	var _entitiesArray2 = _interopRequireDefault(_entitiesArray);

	/**
	 * TODO: gzip with https://github.com/jstuckey/gulp-gzip
	 * TODO: handle exceptions inside computed
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

	var Baxter = (function () {
	    function Baxter() {
	        var _this = this;

	        _classCallCheck(this, Baxter);

	        /**
	         * @description Basic unique id, other uids are incremented from this
	         * @type {number}
	         */
	        var UID = 1;

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
	        this.eventStream = new _servicesEvent2['default'](this);

	        /**
	         * @name Baxter.utils
	         * @type {Object}
	         */
	        this.utils = {
	            createObjectUID: function createObjectUID(object) {
	                var uid = UID++;

	                Object.defineProperty(object, '__uid__', {
	                    enumerable: false,
	                    value: uid
	                });

	                return uid;
	            },

	            getUIDByObject: function getUIDByObject(object) {
	                if (!object['__uid__']) {
	                    return _this.utils.createObjectUID(object);
	                }

	                return object['__uid__'];
	            },

	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            }
	        };

	        this.subscribeEvent('will-change', this.debounce(function () {
	            return _this.postEvent('will-change-all');
	        }, 20));
	    }

	    //TODO: move to utils
	    /**
	     * @name Baxter.debounce
	     * @param {Function} func
	     * @param {Number} wait
	     * @returns {Function} debounced function
	     */

	    _createClass(Baxter, [{
	        key: 'debounce',
	        value: function debounce(func, wait) {
	            var timeout;
	            return function () {
	                var later = function later() {
	                    func();
	                    timeout = null;
	                };
	                clearTimeout(timeout);
	                timeout = setTimeout(later, wait);
	            };
	        }

	        /**
	         * @name Baxter.dispose
	         * @param owner
	         * @param key
	         * @returns {boolean}
	         */
	    }, {
	        key: 'dispose',
	        value: function dispose(owner, key) {
	            if (!key) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = Object.keys(owner)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var field = _step.value;

	                        var uid = this.utils.createKeyUID(owner, field);
	                        var handlers = this.variables.get(uid);

	                        if (!handlers) {
	                            continue;
	                        }

	                        var _iteratorNormalCompletion2 = true;
	                        var _didIteratorError2 = false;
	                        var _iteratorError2 = undefined;

	                        try {
	                            for (var _iterator2 = handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                var handler = _step2.value;

	                                handler.dispose();
	                                delete owner[field];
	                            }
	                        } catch (err) {
	                            _didIteratorError2 = true;
	                            _iteratorError2 = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                                    _iterator2['return']();
	                                }
	                            } finally {
	                                if (_didIteratorError2) {
	                                    throw _iteratorError2;
	                                }
	                            }
	                        }

	                        this.variables['delete'](uid);
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator['return']) {
	                            _iterator['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }

	                return true;
	            } else {
	                var uid = this.utils.createKeyUID(owner, key);
	                var handlers = this.variables.get(uid);

	                if (!handlers) {
	                    return false;
	                }

	                var _iteratorNormalCompletion3 = true;
	                var _didIteratorError3 = false;
	                var _iteratorError3 = undefined;

	                try {
	                    for (var _iterator3 = handlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var handler = _step3.value;

	                        handler.dispose();
	                        delete owner[key];
	                    }
	                } catch (err) {
	                    _didIteratorError3 = true;
	                    _iteratorError3 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                            _iterator3['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError3) {
	                            throw _iteratorError3;
	                        }
	                    }
	                }

	                this.variables['delete'](uid);
	            }
	        }

	        /**
	         * @name Baxter.subscribeEvent
	         * @param {String} eventType
	         * @param {Function} subscriber
	         */
	    }, {
	        key: 'subscribeEvent',
	        value: function subscribeEvent(eventType, subscriber) {
	            var _this2 = this;

	            this.eventStream.on(eventType, subscriber);

	            return {
	                dispose: function dispose() {
	                    return _this2.eventStream.off(eventType, subscriber);
	                }
	            };
	        }

	        /**
	         * @name Baxter.postEvent
	         * @param {String} eventType
	         * @param {*} [data]
	         */
	    }, {
	        key: 'postEvent',
	        value: function postEvent(eventType, data) {
	            this.eventStream.post(eventType, data);
	        }

	        /**
	         * @name Baxter.subscribe
	         * @param {Object} owner
	         * @param {String} key
	         * @param {Function} subscriber
	         * @param {String} [eventType]
	         * @throws {LibraryError}
	         */
	    }, {
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            var eventType = arguments.length <= 3 || arguments[3] === undefined ? 'update' : arguments[3];

	            if (!owner || !key || !subscriber) {
	                throw new _entitiesError2['default']('can\'t subscribe variable without owner, key or callback function.');
	            }
	            var uid = this.utils.createKeyUID(owner, key);
	            var availableEvents = ['will-change', 'update'];
	            var eventToListen = availableEvents.indexOf(eventType) !== -1 && eventType;
	            var eventHandler = function eventHandler(config) {
	                if (config.uid === uid) {
	                    subscriber(config.value, config.oldValue);
	                }
	            };

	            if (!eventToListen) {
	                throw new _entitiesError2['default']('subscribe: listening ' + eventType + ' event is not accepted.');
	            }

	            return this.subscribeEvent(eventToListen, eventHandler);
	        }

	        /**
	         * @name Baxter.resolve
	         * @param {Set} dependencies
	         * @returns {Promise}
	         */
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            var result = new Set();

	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;

	            try {
	                for (var _iterator4 = dependencies[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                    var dependency = _step4.value;

	                    result.add(this.callstack.get(dependency));
	                }
	            } catch (err) {
	                _didIteratorError4 = true;
	                _iteratorError4 = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                        _iterator4['return']();
	                    }
	                } finally {
	                    if (_didIteratorError4) {
	                        throw _iteratorError4;
	                    }
	                }
	            }

	            return Promise.all(result);
	        }

	        /**
	         * @name Baxter.getDependencies
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {Promise}
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(computed, callback) {
	            var listener = this.subscribeEvent('get', callback);
	            var computingResult = computed();

	            listener.dispose();

	            return new Promise(function (resolve) {
	                resolve(computingResult);
	            }).then(function (result) {
	                return result;
	            });
	        }

	        /**
	         * @name Baxter.addToStack
	         * @param {Object} owner
	         * @param {String} key
	         * @param {Function} callback
	         */
	    }, {
	        key: 'addToStack',
	        value: function addToStack(owner, key, callback) {
	            var _this3 = this;

	            var uid = this.utils.createKeyUID(owner, key);
	            var handler = function handler(resolve) {
	                _this3.callstack['delete'](uid);
	                if (!_this3.callstack.size) {
	                    _this3.postEvent('change-complete');
	                }
	                resolve();
	            };

	            this.postEvent('will-change', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });

	            this.callstack.set(uid, new Promise(function (resolve) {
	                /**
	                 * When will change chain is complete, then resolve
	                 */
	                _this3.eventStream.once('will-change-all', function () {
	                    var resolveResult = callback();
	                    if (resolveResult instanceof Promise) {
	                        resolveResult.then(function () {
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
	    }, {
	        key: 'observable',
	        value: function observable(owner, key, initialValue) {
	            var _this4 = this;

	            var value = initialValue;
	            var uid = this.utils.createKeyUID(owner, key);

	            Object.defineProperty(owner, key, {
	                configurable: true,
	                set: function set(newValue) {
	                    if (newValue === value) {
	                        return false;
	                    }

	                    _this4.addToStack(owner, key, function () {
	                        var oldValue = value;

	                        value = newValue;

	                        _this4.eventStream.post('update', {
	                            uid: uid,
	                            owner: owner,
	                            key: key,
	                            value: value,
	                            oldValue: oldValue
	                        });
	                    });
	                },

	                get: function get() {
	                    _this4.eventStream.post('get', {
	                        uid: uid,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });
	                    return value;
	                }
	            });

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
	    }, {
	        key: 'computed',
	        value: function computed(owner, key, computedObservable, userDependencies) {
	            var _this5 = this;

	            var value = undefined;
	            var oldValue = undefined;
	            var isComputing = false;
	            var computedUID = this.utils.createKeyUID(owner, key);
	            var canUpdate = false;
	            var dependencies = new Set();
	            var handlers = new Set();

	            this.variables.set(computedUID, handlers);

	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: function get() {
	                    _this5.eventStream.post('get', {
	                        uid: computedUID,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });

	                    return value;
	                },
	                set: function set(computedValue) {
	                    if (!canUpdate) {
	                        throw new _entitiesError2['default']('you can\'t set value to computed');
	                    }
	                    canUpdate = false;
	                    value = computedValue;

	                    if (value === oldValue) {
	                        return false;
	                    }

	                    _this5.eventStream.post('update', {
	                        uid: computedUID,
	                        owner: owner,
	                        key: key,
	                        value: value,
	                        oldValue: oldValue
	                    });
	                }
	            });

	            var handleObservable = function handleObservable(handledValue) {
	                if (handledValue.uid === computedUID) {
	                    throw new _entitiesError2['default']('Circular dependencies detected on ' + key + ' value.');
	                }

	                dependencies.add(_this5.utils.createKeyUID(handledValue.owner, handledValue.key));

	                var subscriber = _this5.subscribe(handledValue.owner, handledValue.key, function () {
	                    if (isComputing) {
	                        return false;
	                    }

	                    _this5.addToStack(owner, key, function () {
	                        return _this5.resolve(dependencies).then(function () {
	                            oldValue = value;
	                            return computedObservable.call(owner);
	                        }).then(function (value) {
	                            isComputing = false;
	                            canUpdate = true;
	                            owner[key] = value;
	                        });
	                    });

	                    isComputing = true;
	                }, 'will-change');

	                handlers.add(subscriber);
	            };

	            if (Symbol.iterator in Object(userDependencies)) {
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;

	                try {
	                    for (var _iterator5 = userDependencies[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var userDependency = _step5.value;

	                        handleObservable(userDependency);
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	                            _iterator5['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }
	            }

	            this.getDependencies(computedObservable, handleObservable).then(function (resolvedValue) {
	                _this5.addToStack(owner, key, function () {
	                    return _this5.resolve(dependencies).then(function () {
	                        canUpdate = true;
	                        owner[key] = resolvedValue;
	                    });
	                });
	            });

	            return value;
	        }
	    }, {
	        key: 'array',
	        value: function array(owner, key, initialValues) {
	            var _this6 = this;

	            var uid = this.utils.createKeyUID(owner, key);

	            //TODO: track dependencies

	            var observableArray = new _entitiesArray2['default'](uid, owner, key, this.eventStream, initialValues);

	            owner[key] = observableArray;

	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: function get() {
	                    return observableArray;
	                },
	                set: function set(value) {
	                    _this6.eventStream.post('update', {
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
	    }, {
	        key: 'watch',
	        value: function watch(object) {
	            for (var key in object) {
	                if (!object.hasOwnProperty(key)) {
	                    continue;
	                }

	                var value = object[key];
	                if (typeof value === 'function') {
	                    this.computed(object, key, value);
	                } /*else if (Object.prototype.toString.call(value) === '[object Array]') {
	                    this.array(object, key, value);
	                  }*/else {
	                        this.observable(object, key, value);
	                    }
	            }

	            return object;
	        }
	    }]);

	    return Baxter;
	})();

	exports['default'] = Baxter;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class EventService
	 */

	var EventService = (function () {
	    function EventService(defaultContext) {
	        _classCallCheck(this, EventService);

	        /**
	         * @name EventService.channels
	         * @type {Object}
	         */
	        this.channels = {};

	        /**
	         * @name EventService.context
	         * @type {Object}
	         */
	        this.context = defaultContext || this;
	    }

	    /**
	     * @name EventService.getEvent
	     * @param {String} event
	     * @returns {Set}
	     */

	    _createClass(EventService, [{
	        key: "getEvent",
	        value: function getEvent(event) {
	            if (!(event in this.channels)) {
	                return this.channels[event] = new Set();
	            }

	            return this.channels[event];
	        }

	        /**
	         * @name EventService.on
	         * @param {string} event - Event name
	         * @param {function} handler - Callback function with data as argument
	         */
	    }, {
	        key: "on",
	        value: function on(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }

	            this.getEvent(event).add(handler);
	        }

	        /**
	         * @name EventService.once
	         * @param {string} event
	         * @param {function} handler
	         */
	    }, {
	        key: "once",
	        value: function once(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }

	            var that = this;

	            this.getEvent(event).add(handlerWrapper);

	            function handlerWrapper(data) {
	                that.off(event, handlerWrapper);
	                return handler(data);
	            }
	        }

	        /**
	         * @name EventService.off
	         * @param {string} event
	         * @param {function} [handlerToDelete]
	         * @returns {boolean}
	         */
	    }, {
	        key: "off",
	        value: function off(event, handlerToDelete) {
	            if (!event) {
	                throw new Error("Can't remove event listener: no event");
	            }

	            if (!handlerToDelete) {
	                return delete this.channels[event];
	            }

	            var eventHandlers = this.channels[event];

	            eventHandlers["delete"](handlerToDelete);

	            if (!eventHandlers.size) {
	                delete this.channels[event];
	            }
	        }

	        /**
	         * @name EventService.post
	         * @param {string} event
	         * @param {*} data
	         */
	    }, {
	        key: "post",
	        value: function post(event, data) {
	            if (!event) {
	                throw new Error("Can't post undefined event");
	            }

	            if (!(event in this.channels)) {
	                return false;
	            }

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = this.channels[event][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var handler = _step.value;

	                    handler.call(this.context, data);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator["return"]) {
	                        _iterator["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }]);

	    return EventService;
	})();

	exports["default"] = EventService;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var LibraryError = function LibraryError(message) {
	    _classCallCheck(this, LibraryError);

	    return new Error('[Twin.js]: ' + message);
	};

	exports['default'] = LibraryError;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ObservableArray = (function (_Array) {
	    _inherits(ObservableArray, _Array);

	    function ObservableArray(uid, owner, key, eventService, values) {
	        _classCallCheck(this, ObservableArray);

	        _get(Object.getPrototypeOf(ObservableArray.prototype), 'constructor', this).call(this);
	        Object.assign(this, values);
	        this.length = values.length;
	        this.eventStream = eventService;
	        this.owner = owner;
	        this.key = key;
	        this.uid = uid;
	    }

	    _createClass(ObservableArray, [{
	        key: 'push',
	        value: function push(value) {
	            var index = _get(Object.getPrototypeOf(ObservableArray.prototype), 'push', this).call(this, value);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'push',
	                changed: this[index]
	            });

	            return index;
	        }
	    }, {
	        key: 'shift',
	        value: function shift() {
	            var deletedValue = _get(Object.getPrototypeOf(ObservableArray.prototype), 'shift', this).call(this);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'shift',
	                changed: deletedValue
	            });

	            return deletedValue;
	        }
	    }, {
	        key: 'pop',
	        value: function pop() {
	            var lastValue = _get(Object.getPrototypeOf(ObservableArray.prototype), 'pop', this).call(this);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'pop',
	                changed: lastValue
	            });

	            return lastValue;
	        }
	    }, {
	        key: 'unshift',
	        value: function unshift() {
	            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
	                values[_key] = arguments[_key];
	            }

	            var mergedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'unshift', this).apply(this, values);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'unshift',
	                changed: values
	            });

	            return mergedArray;
	        }
	    }, {
	        key: 'reverse',
	        value: function reverse() {
	            var reversedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'reverse', this).call(this);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'reverse',
	                changed: reversedArray
	            });

	            return reversedArray;
	        }
	    }, {
	        key: 'sort',
	        value: function sort(sortFunction) {
	            var sortedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'sort', this).call(this, sortFunction);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'sort',
	                changed: sortedArray
	            });

	            return sortedArray;
	        }
	    }, {
	        key: 'splice',
	        value: function splice() {
	            for (var _len2 = arguments.length, arguments = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                arguments[_key2] = arguments[_key2];
	            }

	            var splicedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'splice', this).apply(this, arguments);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this,
	                type: 'splice',
	                changed: splicedArray
	            });

	            return splicedArray;
	        }
	    }]);

	    return ObservableArray;
	})(Array);

	exports['default'] = ObservableArray;
	module.exports = exports['default'];

/***/ }
/******/ ]);