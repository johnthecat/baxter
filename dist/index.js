/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _baxter = __webpack_require__(1);
	
	var _baxter2 = _interopRequireDefault(_baxter);
	
	(function (name, lib, browserContext) {
	    if (browserContext) {
	        browserContext[name] = lib;
	    } else if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = lib;
	        }
	        exports[name] = lib;
	    }
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
	            /**
	             * @name Baxter.utils.createObjectUID
	             * @param object
	             * @returns {number}
	             */
	            createObjectUID: function createObjectUID(object) {
	                var uid = UID++;
	
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
	            getUIDByObject: function getUIDByObject(object) {
	                if (!object['__uid__']) {
	                    return _this.utils.createObjectUID(object);
	                }
	
	                return object['__uid__'];
	            },
	
	            /**
	             * @name Baxter.utils.createKeyUID
	             * @param owner
	             * @param key
	             * @returns {string}
	             */
	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            },
	
	            /**
	             * @name Baxter.utils.debounce
	             * @param {Function} func
	             * @param {Number} wait
	             * @returns {Function} debounced function
	             */
	            debounce: function debounce(func, wait) {
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
	        };
	
	        this.subscribeEvent('will-change', this.utils.debounce(function () {
	            return _this.postEvent('will-change-all');
	        }, 0));
	    }
	
	    /**
	     * @name Baxter.dispose
	     * @param owner
	     * @param key
	     */
	
	    _createClass(Baxter, [{
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
	            } else {
	                var uid = this.utils.createKeyUID(owner, key);
	                var handlers = this.variables.get(uid);
	
	                if (!handlers) {
	                    return;
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
	         * @param {Boolean} [once]
	         */
	    }, {
	        key: 'subscribeEvent',
	        value: function subscribeEvent(eventType, subscriber) {
	            var _this2 = this;
	
	            var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	            if (once) {
	                this.eventStream.once(eventType, subscriber);
	            } else {
	                this.eventStream.on(eventType, subscriber);
	
	                return {
	                    dispose: function dispose() {
	                        return _this2.eventStream.off(eventType, subscriber);
	                    }
	                };
	            }
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
	         * @param {Boolean} [once]
	         * @throws {LibraryError}
	         */
	    }, {
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            var eventType = arguments.length <= 3 || arguments[3] === undefined ? 'update' : arguments[3];
	            var once = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
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
	
	            return this.subscribeEvent(eventToListen, eventHandler, once);
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
	         * @param {Object} context
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {*} Result of computing
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(context, computed, callback) {
	            var listener = this.subscribeEvent('get', callback);
	            var computingResult = computed.call(context);
	
	            listener.dispose();
	
	            return computingResult;
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
	
	            this.postEvent('will-change', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });
	
	            this.callstack.set(uid, new Promise(function (resolve) {
	                _this3.subscribeEvent('will-change-all', function () {
	                    resolve(callback());
	                }, true);
	            }).then(function () {
	                _this3.callstack['delete'](uid);
	                if (!_this3.callstack.size) {
	                    _this3.postEvent('change-complete');
	                }
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
	
	            if (this.variables.has(uid)) {
	                return initialValue;
	            }
	
	            this.variables.set(uid, new Set());
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                set: function set(newValue) {
	                    if (newValue === value) {
	                        return false;
	                    }
	
	                    _this4.addToStack(owner, key, function () {
	                        var oldValue = value;
	
	                        value = newValue;
	
	                        _this4.postEvent('update', {
	                            uid: uid,
	                            owner: owner,
	                            key: key,
	                            value: value,
	                            oldValue: oldValue
	                        });
	                    });
	                },
	
	                get: function get() {
	                    _this4.postEvent('get', {
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
	
	            if (this.variables.has(computedUID)) {
	                return computedObservable;
	            }
	
	            this.variables.set(computedUID, handlers);
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: function get() {
	                    _this5.postEvent('get', {
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
	
	                    _this5.postEvent('update', {
	                        uid: computedUID,
	                        owner: owner,
	                        key: key,
	                        value: value,
	                        oldValue: oldValue
	                    });
	                }
	            });
	
	            var handleObservable = function handleObservable(handledValue) {
	                dependencies.add(handledValue.uid);
	
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
	                        })['catch'](function () {
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
	
	            var calculatedValue = this.getDependencies(owner, computedObservable, handleObservable);
	            if (calculatedValue instanceof Promise) {
	                calculatedValue.then(function (result) {
	                    _this5.addToStack(owner, key, function () {
	                        return _this5.resolve(dependencies).then(function () {
	                            canUpdate = true;
	                            owner[key] = result;
	                        });
	                    });
	                });
	            } else {
	                canUpdate = true;
	                owner[key] = calculatedValue;
	            }
	
	            return value;
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
	                } else {
	                    this.observable(object, key, value);
	                }
	            }
	
	            return object;
	        }
	    }]);
	
	    return Baxter;
	})();
	
	exports['default'] = new Baxter();
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTRkZDg2NzMwMzIwODk1ZTM4MDciLCJ3ZWJwYWNrOi8vL0M6L1VzZXJzL1NlcmdleS5adXJhdmxldi9EZXNrdG9wL2JheHRlci9iYXh0ZXIvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy9DOi9Vc2Vycy9TZXJnZXkuWnVyYXZsZXYvRGVza3RvcC9iYXh0ZXIvYmF4dGVyL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vL0M6L1VzZXJzL1NlcmdleS5adXJhdmxldi9EZXNrdG9wL2JheHRlci9iYXh0ZXIvc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy9DOi9Vc2Vycy9TZXJnZXkuWnVyYXZsZXYvRGVza3RvcC9iYXh0ZXIvYmF4dGVyL3NyYy9lbnRpdGllcy9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O21DQ3RDbUIsQ0FBVTs7OztBQUU3QixFQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUs7QUFDNUIsU0FBSSxjQUFjLEVBQUU7QUFDaEIsdUJBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDOUIsTUFBTSxJQUFJLElBQThCLEVBQUU7QUFDdkMsYUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNqRCxvQkFBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1VBQ2xDO0FBQ0QsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDdkI7RUFDSixFQUFFLFFBQVEs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QUksQ0FBQyxLQUFLLEVBQUU7QUFDUix1QkFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2NBQ2pEOztBQUVELGlCQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMzQix3QkFBTyxLQUFLLENBQUM7Y0FDaEI7Ozs7Ozs7QUFFRCxzQ0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsOEhBQUU7eUJBQWpDLE9BQU87O0FBQ1osNEJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztrQkFDcEM7Ozs7Ozs7Ozs7Ozs7OztVQUNKOzs7WUF4R0MsWUFBWTs7O3NCQTJHSCxZQUFZOzs7Ozs7Ozs7Ozs7O0tDOUdyQixZQUFZLEdBQ0gsU0FEVCxZQUFZLENBQ0YsT0FBTyxFQUFFOzJCQURuQixZQUFZOztBQUVWLFlBQU8sSUFBSSxLQUFLLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0VBQzdDOztzQkFHVSxZQUFZIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxNGRkODY3MzAzMjA4OTVlMzgwN1xuICoqLyIsImltcG9ydCBiYXh0ZXIgZnJvbSAnLi9iYXh0ZXInO1xyXG5cclxuKChuYW1lLCBsaWIsIGJyb3dzZXJDb250ZXh0KSA9PiB7XHJcbiAgICBpZiAoYnJvd3NlckNvbnRleHQpIHtcclxuICAgICAgICBicm93c2VyQ29udGV4dFtuYW1lXSA9IGxpYjtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXhwb3J0c1tuYW1lXSA9IGxpYjtcclxuICAgIH1cclxufSkoJ2JheHRlcicsIGJheHRlciwgd2luZG93KTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovVXNlcnMvU2VyZ2V5Llp1cmF2bGV2L0Rlc2t0b3AvYmF4dGVyL2JheHRlci9zcmMvaW5kZXguanNcbiAqKi8iLCJpbXBvcnQgRXZlbnRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvZXZlbnQnO1xyXG5pbXBvcnQgTGlicmFyeUVycm9yIGZyb20gJy4vZW50aXRpZXMvZXJyb3InO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBCYXh0ZXJcclxuICogQGRlc2NyaXB0aW9uIE1haW4gY2xhc3MsIHByb3ZpZGVzIGxpYnJhcnkgYXMgaXQgc2VsZi5cclxuICovXHJcbmNsYXNzIEJheHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQmFzaWMgdW5pcXVlIGlkLCBvdGhlciB1aWRzIGFyZSBpbmNyZW1lbnRlZCBmcm9tIHRoaXNcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGxldCBVSUQgPSAxO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAbmFtZSBCYXh0ZXIuY2FsbHN0YWNrXHJcbiAgICAgICAgICogQHR5cGUge01hcH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNhbGxzdGFjayA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLnZhcmlhYmxlc1xyXG4gICAgICAgICAqIEB0eXBlIHtNYXB9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIEJheHRlci5ldmVudFN0cmVhbVxyXG4gICAgICAgICAqIEB0eXBlIHtFdmVudFNlcnZpY2V9XHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFByb3ZpZGVzIGV2ZW50cyBzZXJ2aWNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbSA9IG5ldyBFdmVudFNlcnZpY2UodGhpcyk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIEJheHRlci51dGlsc1xyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51dGlscyA9IHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlci51dGlscy5jcmVhdGVPYmplY3RVSURcclxuICAgICAgICAgICAgICogQHBhcmFtIG9iamVjdFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY3JlYXRlT2JqZWN0VUlEOiAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdWlkID0gVUlEKys7XHJcblxyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fdWlkX18nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVpZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpZDtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmFtZSBCYXh0ZXIudXRpbHMuZ2V0VUlEQnlPYmplY3RcclxuICAgICAgICAgICAgICogQHBhcmFtIG9iamVjdFxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldFVJREJ5T2JqZWN0OiAob2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iamVjdFsnX191aWRfXyddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY3JlYXRlT2JqZWN0VUlEKG9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFsnX191aWRfXyddXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmNyZWF0ZUtleVVJRFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gb3duZXJcclxuICAgICAgICAgICAgICogQHBhcmFtIGtleVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY3JlYXRlS2V5VUlEOiAob3duZXIsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuZ2V0VUlEQnlPYmplY3Qob3duZXIpICsgJzonICsga2V5O1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlci51dGlscy5kZWJvdW5jZVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3YWl0XHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gZGVib3VuY2VkIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBkZWJvdW5jZTogKGZ1bmMsIHdhaXQpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lb3V0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGF0ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlRXZlbnQoJ3dpbGwtY2hhbmdlJywgdGhpcy51dGlscy5kZWJvdW5jZSgoKSA9PiB0aGlzLnBvc3RFdmVudCgnd2lsbC1jaGFuZ2UtYWxsJyksIDApKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIEJheHRlci5kaXNwb3NlXHJcbiAgICAgKiBAcGFyYW0gb3duZXJcclxuICAgICAqIEBwYXJhbSBrZXlcclxuICAgICAqL1xyXG4gICAgZGlzcG9zZShvd25lciwga2V5KSB7XHJcbiAgICAgICAgaWYgKCFrZXkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgKE9iamVjdC5rZXlzKG93bmVyKSkpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwgZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZXJzID0gdGhpcy52YXJpYWJsZXMuZ2V0KHVpZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFoYW5kbGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgb3duZXJbZmllbGRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVzLmRlbGV0ZSh1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xyXG4gICAgICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLnZhcmlhYmxlcy5nZXQodWlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiBoYW5kbGVycykge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgb3duZXJba2V5XTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuZGVsZXRlKHVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgQmF4dGVyLnN1YnNjcmliZUV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmVyXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlXVxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmVFdmVudChldmVudFR5cGUsIHN1YnNjcmliZXIsIG9uY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIGlmIChvbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub25jZShldmVudFR5cGUsIHN1YnNjcmliZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub24oZXZlbnRUeXBlLCBzdWJzY3JpYmVyKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwb3NlOiAoKSA9PiB0aGlzLmV2ZW50U3RyZWFtLm9mZihldmVudFR5cGUsIHN1YnNjcmliZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBCYXh0ZXIucG9zdEV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXHJcbiAgICAgKiBAcGFyYW0geyp9IFtkYXRhXVxyXG4gICAgICovXHJcbiAgICBwb3N0RXZlbnQoZXZlbnRUeXBlLCBkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KGV2ZW50VHlwZSwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBCYXh0ZXIuc3Vic2NyaWJlXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZXJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRUeXBlXVxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZV1cclxuICAgICAqIEB0aHJvd3Mge0xpYnJhcnlFcnJvcn1cclxuICAgICAqL1xyXG4gICAgc3Vic2NyaWJlKG93bmVyLCBrZXksIHN1YnNjcmliZXIsIGV2ZW50VHlwZSA9ICd1cGRhdGUnLCBvbmNlID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoIW93bmVyIHx8ICFrZXkgfHwgIXN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IExpYnJhcnlFcnJvcignY2FuXFwndCBzdWJzY3JpYmUgdmFyaWFibGUgd2l0aG91dCBvd25lciwga2V5IG9yIGNhbGxiYWNrIGZ1bmN0aW9uLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUV2ZW50cyA9IFsnd2lsbC1jaGFuZ2UnLCAndXBkYXRlJ107XHJcbiAgICAgICAgbGV0IGV2ZW50VG9MaXN0ZW4gPSBhdmFpbGFibGVFdmVudHMuaW5kZXhPZihldmVudFR5cGUpICE9PSAtMSAmJiBldmVudFR5cGU7XHJcbiAgICAgICAgbGV0IGV2ZW50SGFuZGxlciA9IChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbmZpZy51aWQgPT09IHVpZCkge1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcihjb25maWcudmFsdWUsIGNvbmZpZy5vbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIWV2ZW50VG9MaXN0ZW4pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IExpYnJhcnlFcnJvcignc3Vic2NyaWJlOiBsaXN0ZW5pbmcgJyArIGV2ZW50VHlwZSArICcgZXZlbnQgaXMgbm90IGFjY2VwdGVkLicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlRXZlbnQoZXZlbnRUb0xpc3RlbiwgZXZlbnRIYW5kbGVyLCBvbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIEJheHRlci5yZXNvbHZlXHJcbiAgICAgKiBAcGFyYW0ge1NldH0gZGVwZW5kZW5jaWVzXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgICAqL1xyXG4gICAgcmVzb2x2ZShkZXBlbmRlbmNpZXMpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IFNldCgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBkZXBlbmRlbmN5IG9mIGRlcGVuZGVuY2llcykge1xyXG4gICAgICAgICAgICByZXN1bHQuYWRkKHRoaXMuY2FsbHN0YWNrLmdldChkZXBlbmRlbmN5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIEJheHRlci5nZXREZXBlbmRlbmNpZXNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wdXRlZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAqIEByZXR1cm5zIHsqfSBSZXN1bHQgb2YgY29tcHV0aW5nXHJcbiAgICAgKi9cclxuICAgIGdldERlcGVuZGVuY2llcyhjb250ZXh0LCBjb21wdXRlZCwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgbGlzdGVuZXIgPSB0aGlzLnN1YnNjcmliZUV2ZW50KCdnZXQnLCBjYWxsYmFjayk7XHJcbiAgICAgICAgbGV0IGNvbXB1dGluZ1Jlc3VsdCA9IGNvbXB1dGVkLmNhbGwoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGxpc3RlbmVyLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbXB1dGluZ1Jlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIEJheHRlci5hZGRUb1N0YWNrXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIGFkZFRvU3RhY2sob3duZXIsIGtleSwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zdEV2ZW50KCd3aWxsLWNoYW5nZScsIHtcclxuICAgICAgICAgICAgdWlkOiB1aWQsXHJcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcclxuICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jYWxsc3RhY2suc2V0KHVpZCwgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVFdmVudCgnd2lsbC1jaGFuZ2UtYWxsJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsc3RhY2suZGVsZXRlKHVpZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2FsbHN0YWNrLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnY2hhbmdlLWNvbXBsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIEJheHRlci5vYnNlcnZhYmxlXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcclxuICAgICAqIEBwYXJhbSB7Kn0gaW5pdGlhbFZhbHVlXHJcbiAgICAgKiBAcmV0dXJucyB7Kn0gdmFsdWVcclxuICAgICAqL1xyXG4gICAgb2JzZXJ2YWJsZShvd25lciwga2V5LCBpbml0aWFsVmFsdWUpIHtcclxuICAgICAgICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XHJcbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52YXJpYWJsZXMuaGFzKHVpZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLnNldCh1aWQsIG5ldyBTZXQoKSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvd25lciwga2V5LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZXQ6IChuZXdWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKG93bmVyLCBrZXksICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3VwZGF0ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgQmF4dGVyLmNvbXB1dGVkXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkT2JzZXJ2YWJsZVxyXG4gICAgICogQHBhcmFtIHtTZXR8TWFwfEFycmF5fSBbdXNlckRlcGVuZGVuY2llc11cclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBjb21wdXRlZChvd25lciwga2V5LCBjb21wdXRlZE9ic2VydmFibGUsIHVzZXJEZXBlbmRlbmNpZXMpIHtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgbGV0IG9sZFZhbHVlO1xyXG4gICAgICAgIGxldCBpc0NvbXB1dGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBjb21wdXRlZFVJRCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xyXG4gICAgICAgIGxldCBjYW5VcGRhdGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xyXG4gICAgICAgIGxldCBoYW5kbGVycyA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmFyaWFibGVzLmhhcyhjb21wdXRlZFVJRCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkT2JzZXJ2YWJsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLnNldChjb21wdXRlZFVJRCwgaGFuZGxlcnMpO1xyXG5cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3duZXIsIGtleSwge1xyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGdldDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsIHtcclxuICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbXB1dGVkVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiAoY29tcHV0ZWRWYWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjYW5VcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCd5b3UgY2FuXFwndCBzZXQgdmFsdWUgdG8gY29tcHV0ZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhblVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjb21wdXRlZFZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3VwZGF0ZScsIHtcclxuICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbXB1dGVkVUlELFxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcclxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgaGFuZGxlT2JzZXJ2YWJsZSA9IChoYW5kbGVkVmFsdWUpID0+IHtcclxuICAgICAgICAgICAgZGVwZW5kZW5jaWVzLmFkZChoYW5kbGVkVmFsdWUudWlkKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVyID0gdGhpcy5zdWJzY3JpYmUoaGFuZGxlZFZhbHVlLm93bmVyLCBoYW5kbGVkVmFsdWUua2V5LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDb21wdXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKG93bmVyLCBrZXksICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZE9ic2VydmFibGUuY2FsbChvd25lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wdXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcltrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXNDb21wdXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LCAnd2lsbC1jaGFuZ2UnKTtcclxuXHJcbiAgICAgICAgICAgIGhhbmRsZXJzLmFkZChzdWJzY3JpYmVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh1c2VyRGVwZW5kZW5jaWVzKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB1c2VyRGVwZW5kZW5jeSBvZiB1c2VyRGVwZW5kZW5jaWVzKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVPYnNlcnZhYmxlKHVzZXJEZXBlbmRlbmN5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbGN1bGF0ZWRWYWx1ZSA9IHRoaXMuZ2V0RGVwZW5kZW5jaWVzKG93bmVyLCBjb21wdXRlZE9ic2VydmFibGUsIGhhbmRsZU9ic2VydmFibGUpO1xyXG4gICAgICAgIGlmIChjYWxjdWxhdGVkVmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRWYWx1ZS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG9TdGFjayhvd25lciwga2V5LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZShkZXBlbmRlbmNpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhblVwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcltrZXldID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYW5VcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBvd25lcltrZXldID0gY2FsY3VsYXRlZFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgQmF4dGVyLndhdGNoXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHdhdGNoKG9iamVjdCkge1xyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9iamVjdFtrZXldO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVkKG9iamVjdCwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmFibGUob2JqZWN0LCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEJheHRlcigpO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9Vc2Vycy9TZXJnZXkuWnVyYXZsZXYvRGVza3RvcC9iYXh0ZXIvYmF4dGVyL3NyYy9iYXh0ZXIuanNcbiAqKi8iLCIvKipcclxuICogQGNsYXNzIEV2ZW50U2VydmljZVxyXG4gKi9cclxuY2xhc3MgRXZlbnRTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlZmF1bHRDb250ZXh0KSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLmNoYW5uZWxzXHJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNoYW5uZWxzID0ge307XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5jb250ZXh0XHJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBkZWZhdWx0Q29udGV4dCB8fCB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLmdldEV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICAgICAqIEByZXR1cm5zIHtTZXR9XHJcbiAgICAgKi9cclxuICAgIGdldEV2ZW50KGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCEoZXZlbnQgaW4gdGhpcy5jaGFubmVscykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbZXZlbnRdID0gbmV3IFNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbZXZlbnRdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBFdmVudCBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBkYXRhIGFzIGFyZ3VtZW50XHJcbiAgICAgKi9cclxuICAgIG9uKGV2ZW50LCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0IGV2ZW50IGxpc3RlbmVyOiBubyBwYXJhbWV0ZXJzIGdpdmVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudChldmVudCkuYWRkKGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uY2VcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvbmNlKGV2ZW50LCBoYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0IGV2ZW50IGxpc3RlbmVyOiBubyBwYXJhbWV0ZXJzIGdpdmVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50KGV2ZW50KS5hZGQoaGFuZGxlcldyYXBwZXIpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVyV3JhcHBlcihkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoYXQub2ZmKGV2ZW50LCBoYW5kbGVyV3JhcHBlcik7XHJcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9mZlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbaGFuZGxlclRvRGVsZXRlXVxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIG9mZihldmVudCwgaGFuZGxlclRvRGVsZXRlKSB7XHJcbiAgICAgICAgaWYgKCFldmVudCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgZXZlbnQgbGlzdGVuZXI6IG5vIGV2ZW50XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFoYW5kbGVyVG9EZWxldGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2V2ZW50XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBldmVudEhhbmRsZXJzID0gdGhpcy5jaGFubmVsc1tldmVudF07XHJcblxyXG4gICAgICAgIGV2ZW50SGFuZGxlcnMuZGVsZXRlKGhhbmRsZXJUb0RlbGV0ZSk7XHJcblxyXG4gICAgICAgIGlmICghZXZlbnRIYW5kbGVycy5zaXplKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2V2ZW50XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UucG9zdFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0geyp9IGRhdGFcclxuICAgICAqL1xyXG4gICAgcG9zdChldmVudCwgZGF0YSkge1xyXG4gICAgICAgIGlmICghZXZlbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcG9zdCB1bmRlZmluZWQgZXZlbnRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIShldmVudCBpbiB0aGlzLmNoYW5uZWxzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuY2hhbm5lbHNbZXZlbnRdKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLmNvbnRleHQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9Vc2Vycy9TZXJnZXkuWnVyYXZsZXYvRGVza3RvcC9iYXh0ZXIvYmF4dGVyL3NyYy9zZXJ2aWNlcy9ldmVudC5qc1xuICoqLyIsImNsYXNzIExpYnJhcnlFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignW1R3aW4uanNdOiAnICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpYnJhcnlFcnJvcjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9Vc2Vycy9TZXJnZXkuWnVyYXZsZXYvRGVza3RvcC9iYXh0ZXIvYmF4dGVyL3NyYy9lbnRpdGllcy9lcnJvci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=