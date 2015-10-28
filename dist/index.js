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
	        }, 20));
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
	         * @returns {Promise}
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(context, computed, callback) {
	            var listener = this.subscribeEvent('get', callback);
	            var computingResult = computed.call(context);
	
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
	
	            this.getDependencies(owner, computedObservable, handleObservable).then(function (resolvedValue) {
	                _this5.addToStack(owner, key, function () {
	                    return _this5.resolve(dependencies).then(function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWQ2Mzg0NzIzMDRkMGQ0OTk1MWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O21DQ3RDbUIsQ0FBVTs7OztBQUU3QixFQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUs7QUFDNUIsU0FBSSxjQUFjLEVBQUU7QUFDaEIsdUJBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDOUIsTUFBTSxJQUFJLElBQThCLEVBQUU7QUFDdkMsYUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNqRCxvQkFBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1VBQ2xDO0FBQ0QsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDdkI7RUFDSixFQUFFLFFBQVEsdUJBQVUsTUFBTSxDQUFDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7MENDWEgsQ0FBa0I7Ozs7MENBQ2xCLENBQWtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBZ0JyQyxNQUFNO0FBQ0csY0FEVCxNQUFNLEdBQ007OzsrQkFEWixNQUFNOzs7Ozs7QUFNSixhQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1aLGFBQUksQ0FBQyxT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QUFqQyxPQUFPOztBQUNaLDRCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7a0JBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7VUFDSjs7O1lBeEdDLFlBQVk7OztzQkEyR0gsWUFBWTs7Ozs7Ozs7Ozs7OztLQzlHckIsWUFBWSxHQUNILFNBRFQsWUFBWSxDQUNGLE9BQU8sRUFBRTsyQkFEbkIsWUFBWTs7QUFFVixZQUFPLElBQUksS0FBSyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBQztFQUM3Qzs7c0JBR1UsWUFBWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWQ2Mzg0NzIzMDRkMGQ0OTk1MWZcbiAqKi8iLCJpbXBvcnQgYmF4dGVyIGZyb20gJy4vYmF4dGVyJztcblxuKChuYW1lLCBsaWIsIGJyb3dzZXJDb250ZXh0KSA9PiB7XG4gICAgaWYgKGJyb3dzZXJDb250ZXh0KSB7XG4gICAgICAgIGJyb3dzZXJDb250ZXh0W25hbWVdID0gbGliO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbGliO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHNbbmFtZV0gPSBsaWI7XG4gICAgfVxufSkoJ2JheHRlcicsIGJheHRlciwgd2luZG93KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IEV2ZW50U2VydmljZSBmcm9tICcuL3NlcnZpY2VzL2V2ZW50JztcbmltcG9ydCBMaWJyYXJ5RXJyb3IgZnJvbSAnLi9lbnRpdGllcy9lcnJvcic7XG5cbi8qKlxuICogVE9ETzogYWRkIGFycmF5IHRyYWNraW5nXG4gKiBUT0RPOiBjbGVhciBjb2RlXG4gKiBUT0RPOiBkb2N1bWVudGF0aW9uXG4gKiBUT0RPOiB1bml0LXRlc3RzXG4gKiBUT0RPOiBwZXJmb3JtYW5jZSB0ZXN0c1xuICogVE9ETzogcGx1Z2luIGhhbmRsZXJcbiAqIFRPRE86IHNpbXBsZSB0ZW1wbGF0ZSBlbmdpbmUgYXMgcGx1Z2luIChsaWtlIGluIGtub2Nrb3V0LmpzKVxuICovXG5cbi8qKlxuICogQGNsYXNzIEJheHRlclxuICogQGRlc2NyaXB0aW9uIE1haW4gY2xhc3MsIHByb3ZpZGVzIGxpYnJhcnkgYXMgaXQgc2VsZi5cbiAqL1xuY2xhc3MgQmF4dGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBCYXNpYyB1bmlxdWUgaWQsIG90aGVyIHVpZHMgYXJlIGluY3JlbWVudGVkIGZyb20gdGhpc1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IFVJRCA9IDE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlci5jYWxsc3RhY2tcbiAgICAgICAgICogQHR5cGUge01hcH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FsbHN0YWNrID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBCYXh0ZXIudmFyaWFibGVzXG4gICAgICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLmV2ZW50U3RyZWFtXG4gICAgICAgICAqIEB0eXBlIHtFdmVudFNlcnZpY2V9XG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBQcm92aWRlcyBldmVudHMgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbSA9IG5ldyBFdmVudFNlcnZpY2UodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlci51dGlsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51dGlscyA9IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmNyZWF0ZU9iamVjdFVJRFxuICAgICAgICAgICAgICogQHBhcmFtIG9iamVjdFxuICAgICAgICAgICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlT2JqZWN0VUlEOiAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVpZCA9IFVJRCsrO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fdWlkX18nLCB7XG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdWlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdWlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmFtZSBCYXh0ZXIudXRpbHMuZ2V0VUlEQnlPYmplY3RcbiAgICAgICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRVSURCeU9iamVjdDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghb2JqZWN0WydfX3VpZF9fJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY3JlYXRlT2JqZWN0VUlEKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFsnX191aWRfXyddXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlci51dGlscy5jcmVhdGVLZXlVSURcbiAgICAgICAgICAgICAqIEBwYXJhbSBvd25lclxuICAgICAgICAgICAgICogQHBhcmFtIGtleVxuICAgICAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlS2V5VUlEOiAob3duZXIsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmdldFVJREJ5T2JqZWN0KG93bmVyKSArICc6JyArIGtleTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmRlYm91bmNlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICAgICAgICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVib3VuY2U6IChmdW5jLCB3YWl0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpYmVFdmVudCgnd2lsbC1jaGFuZ2UnLCB0aGlzLnV0aWxzLmRlYm91bmNlKCgpID0+IHRoaXMucG9zdEV2ZW50KCd3aWxsLWNoYW5nZS1hbGwnKSwgMjApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuZGlzcG9zZVxuICAgICAqIEBwYXJhbSBvd25lclxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKi9cbiAgICBkaXNwb3NlKG93bmVyLCBrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGZpZWxkIG9mIChPYmplY3Qua2V5cyhvd25lcikpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBmaWVsZCk7XG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZXJzID0gdGhpcy52YXJpYWJsZXMuZ2V0KHVpZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvd25lcltmaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuZGVsZXRlKHVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLnZhcmlhYmxlcy5nZXQodWlkKTtcblxuICAgICAgICAgICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiBoYW5kbGVycykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvd25lcltrZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy5kZWxldGUodWlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5zdWJzY3JpYmVFdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmVyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZV1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVFdmVudChldmVudFR5cGUsIHN1YnNjcmliZXIsIG9uY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5vbmNlKGV2ZW50VHlwZSwgc3Vic2NyaWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLm9uKGV2ZW50VHlwZSwgc3Vic2NyaWJlcik7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGlzcG9zZTogKCkgPT4gdGhpcy5ldmVudFN0cmVhbS5vZmYoZXZlbnRUeXBlLCBzdWJzY3JpYmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLnBvc3RFdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0geyp9IFtkYXRhXVxuICAgICAqL1xuICAgIHBvc3RFdmVudChldmVudFR5cGUsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KGV2ZW50VHlwZSwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLnN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtldmVudFR5cGVdXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZV1cbiAgICAgKiBAdGhyb3dzIHtMaWJyYXJ5RXJyb3J9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKG93bmVyLCBrZXksIHN1YnNjcmliZXIsIGV2ZW50VHlwZSA9ICd1cGRhdGUnLCBvbmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFvd25lciB8fCAha2V5IHx8ICFzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCdjYW5cXCd0IHN1YnNjcmliZSB2YXJpYWJsZSB3aXRob3V0IG93bmVyLCBrZXkgb3IgY2FsbGJhY2sgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuICAgICAgICBsZXQgYXZhaWxhYmxlRXZlbnRzID0gWyd3aWxsLWNoYW5nZScsICd1cGRhdGUnXTtcbiAgICAgICAgbGV0IGV2ZW50VG9MaXN0ZW4gPSBhdmFpbGFibGVFdmVudHMuaW5kZXhPZihldmVudFR5cGUpICE9PSAtMSAmJiBldmVudFR5cGU7XG4gICAgICAgIGxldCBldmVudEhhbmRsZXIgPSAoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29uZmlnLnVpZCA9PT0gdWlkKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcihjb25maWcudmFsdWUsIGNvbmZpZy5vbGRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFldmVudFRvTGlzdGVuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCdzdWJzY3JpYmU6IGxpc3RlbmluZyAnICsgZXZlbnRUeXBlICsgJyBldmVudCBpcyBub3QgYWNjZXB0ZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVFdmVudChldmVudFRvTGlzdGVuLCBldmVudEhhbmRsZXIsIG9uY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5yZXNvbHZlXG4gICAgICogQHBhcmFtIHtTZXR9IGRlcGVuZGVuY2llc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHJlc29sdmUoZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgZGVwZW5kZW5jeSBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdC5hZGQodGhpcy5jYWxsc3RhY2suZ2V0KGRlcGVuZGVuY3kpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5nZXREZXBlbmRlbmNpZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBnZXREZXBlbmRlbmNpZXMoY29udGV4dCwgY29tcHV0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lciA9IHRoaXMuc3Vic2NyaWJlRXZlbnQoJ2dldCcsIGNhbGxiYWNrKTtcbiAgICAgICAgbGV0IGNvbXB1dGluZ1Jlc3VsdCA9IGNvbXB1dGVkLmNhbGwoY29udGV4dCk7XG5cbiAgICAgICAgbGlzdGVuZXIuZGlzcG9zZSgpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShjb21wdXRpbmdSZXN1bHQpO1xuICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLmFkZFRvU3RhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBhZGRUb1N0YWNrKG93bmVyLCBrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcblxuICAgICAgICB0aGlzLnBvc3RFdmVudCgnd2lsbC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY2FsbHN0YWNrLnNldCh1aWQsIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZUV2ZW50KCd3aWxsLWNoYW5nZS1hbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWxsYmFjaygpKTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbHN0YWNrLmRlbGV0ZSh1aWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYWxsc3RhY2suc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnY2hhbmdlLWNvbXBsZXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5vYnNlcnZhYmxlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7Kn0gaW5pdGlhbFZhbHVlXG4gICAgICogQHJldHVybnMgeyp9IHZhbHVlXG4gICAgICovXG4gICAgb2JzZXJ2YWJsZShvd25lciwga2V5LCBpbml0aWFsVmFsdWUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG5cbiAgICAgICAgaWYgKHRoaXMudmFyaWFibGVzLmhhcyh1aWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52YXJpYWJsZXMuc2V0KHVpZCwgbmV3IFNldCgpKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3duZXIsIGtleSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc2V0OiAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKG93bmVyLCBrZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgndXBkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuY29tcHV0ZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcHV0ZWRPYnNlcnZhYmxlXG4gICAgICogQHBhcmFtIHtTZXR8TWFwfEFycmF5fSBbdXNlckRlcGVuZGVuY2llc11cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb21wdXRlZChvd25lciwga2V5LCBjb21wdXRlZE9ic2VydmFibGUsIHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBsZXQgb2xkVmFsdWU7XG4gICAgICAgIGxldCBpc0NvbXB1dGluZyA9IGZhbHNlO1xuICAgICAgICBsZXQgY29tcHV0ZWRVSUQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcbiAgICAgICAgbGV0IGNhblVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMudmFyaWFibGVzLmhhcyhjb21wdXRlZFVJRCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlZE9ic2VydmFibGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5zZXQoY29tcHV0ZWRVSUQsIGhhbmRsZXJzKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3duZXIsIGtleSwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkOiBjb21wdXRlZFVJRCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoY29tcHV0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghY2FuVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBMaWJyYXJ5RXJyb3IoJ3lvdSBjYW5cXCd0IHNldCB2YWx1ZSB0byBjb21wdXRlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYW5VcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbXB1dGVkVmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgndXBkYXRlJywge1xuICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbXB1dGVkVUlELFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgaGFuZGxlT2JzZXJ2YWJsZSA9IChoYW5kbGVkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGRlcGVuZGVuY2llcy5hZGQoaGFuZGxlZFZhbHVlLnVpZCk7XG5cbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVyID0gdGhpcy5zdWJzY3JpYmUoaGFuZGxlZFZhbHVlLm93bmVyLCBoYW5kbGVkVmFsdWUua2V5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29tcHV0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU3RhY2sob3duZXIsIGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZE9ic2VydmFibGUuY2FsbChvd25lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5VcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcHV0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcltrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG4gICAgICAgICAgICB9LCAnd2lsbC1jaGFuZ2UnKTtcblxuICAgICAgICAgICAgaGFuZGxlcnMuYWRkKHN1YnNjcmliZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHVzZXJEZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB1c2VyRGVwZW5kZW5jeSBvZiB1c2VyRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlT2JzZXJ2YWJsZSh1c2VyRGVwZW5kZW5jeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldERlcGVuZGVuY2llcyhvd25lciwgY29tcHV0ZWRPYnNlcnZhYmxlLCBoYW5kbGVPYnNlcnZhYmxlKVxuICAgICAgICAgICAgLnRoZW4oKHJlc29sdmVkVmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU3RhY2sob3duZXIsIGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5VcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSByZXNvbHZlZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLndhdGNoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgICAqL1xuICAgIHdhdGNoKG9iamVjdCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZWQob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJheHRlcigpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYmF4dGVyLmpzXG4gKiovIiwiLyoqXG4gKiBAY2xhc3MgRXZlbnRTZXJ2aWNlXG4gKi9cbmNsYXNzIEV2ZW50U2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoZGVmYXVsdENvbnRleHQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5jaGFubmVsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jaGFubmVscyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuY29udGV4dFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gZGVmYXVsdENvbnRleHQgfHwgdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuZ2V0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7U2V0fVxuICAgICAqL1xuICAgIGdldEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gRXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGRhdGEgYXMgYXJndW1lbnRcbiAgICAgKi9cbiAgICBvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgICBpZiAoIWV2ZW50IHx8ICFoYW5kbGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0IGV2ZW50IGxpc3RlbmVyOiBubyBwYXJhbWV0ZXJzIGdpdmVuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRFdmVudChldmVudCkuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5vbmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuICAgICAqL1xuICAgIG9uY2UoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgaW5pdCBldmVudCBsaXN0ZW5lcjogbm8gcGFyYW1ldGVycyBnaXZlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLmdldEV2ZW50KGV2ZW50KS5hZGQoaGFuZGxlcldyYXBwZXIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZXJXcmFwcGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHRoYXQub2ZmKGV2ZW50LCBoYW5kbGVyV3JhcHBlcik7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihkYXRhKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub2ZmXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2hhbmRsZXJUb0RlbGV0ZV1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBvZmYoZXZlbnQsIGhhbmRsZXJUb0RlbGV0ZSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgZXZlbnQgbGlzdGVuZXI6IG5vIGV2ZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZXZlbnRIYW5kbGVycyA9IHRoaXMuY2hhbm5lbHNbZXZlbnRdO1xuXG4gICAgICAgIGV2ZW50SGFuZGxlcnMuZGVsZXRlKGhhbmRsZXJUb0RlbGV0ZSk7XG5cbiAgICAgICAgaWYgKCFldmVudEhhbmRsZXJzLnNpemUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2V2ZW50XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5wb3N0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICovXG4gICAgcG9zdChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBwb3N0IHVuZGVmaW5lZCBldmVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuY2hhbm5lbHNbZXZlbnRdKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcy5jb250ZXh0LCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2VydmljZXMvZXZlbnQuanNcbiAqKi8iLCJjbGFzcyBMaWJyYXJ5RXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignW1R3aW4uanNdOiAnICsgbWVzc2FnZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaWJyYXJ5RXJyb3I7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50aXRpZXMvZXJyb3IuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9