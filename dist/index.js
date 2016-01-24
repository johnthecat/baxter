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

	'use strict';

	var _baxter = __webpack_require__(1);

	var _baxter2 = _interopRequireDefault(_baxter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function (name, lib, browserContext) {
	    if (browserContext) {
	        browserContext[name] = lib;
	    } else if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = lib;
	        }
	        exports[name] = lib;
	    }
	})('baxter', _baxter2.default, window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _error = __webpack_require__(3);

	var _error2 = _interopRequireDefault(_error);

	var _array = __webpack_require__(4);

	var _array2 = _interopRequireDefault(_array);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class Baxter
	 * @description Main class, provides library as it self.
	 */

	var Baxter = function () {
	    function Baxter() {
	        var _this = this;

	        _classCallCheck(this, Baxter);

	        /**
	         * @description Basic unique id, other uids are incremented from this
	         * @type {number}
	         */
	        var UID = 1;

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
	        this.eventStream = new _event2.default(this);

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
	            }
	        };

	        this._watchers = {
	            variable: {
	                get: function get(config) {
	                    var value = config.getValue();

	                    _this.postEvent('get', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: value
	                    });
	                    return value;
	                },
	                set: function set(config, newValue) {
	                    var oldValue = config.getValue();

	                    if (newValue === oldValue) {
	                        return false;
	                    }

	                    _this.postEvent('will-change', {
	                        uid: config.uid,
	                        type: 'variable'
	                    });

	                    config.setValue(newValue);

	                    _this.postEvent('will-change-all');

	                    _this.postEvent('update', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: newValue,
	                        oldValue: oldValue
	                    });
	                }
	            },
	            computed: {
	                get: function get(config) {
	                    var value = config.getValue();

	                    _this.postEvent('get', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: value
	                    });

	                    return value;
	                },
	                set: function set(config, computedResult) {
	                    var oldValue = config.getValue();

	                    if (!config.isComputing()) {
	                        throw new _error2.default('you can\'t set value to computed');
	                    }

	                    if (computedResult === oldValue) {
	                        return false;
	                    }

	                    config.setIsComputing(false);
	                    config.setValue(computedResult);

	                    _this.postEvent('update', {
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

	    _createClass(Baxter, [{
	        key: 'plugin',
	        value: function plugin(namespace, _plugin) {
	            var exceptedNames = ['_callstack', '_variables', '_watchers', 'eventStream', 'utils', 'plugin', 'createClosure', 'subscribeEvent', 'subscribe', 'postEvent', 'resolve', 'getDependencies', 'addToStack', 'variable', 'computed', 'watch', 'dispose'];

	            if (exceptedNames.indexOf(namespace) !== -1) {
	                throw new _error2.default('plugin: name of your plugin is already reserved. Try to rename your plugin');
	            }

	            return this[namespace] = _plugin;
	        }

	        /**
	         * @name Baxter.createClosure
	         * @param {Function} func
	         * @param {*} config
	         * @returns {Function}
	         */

	    }, {
	        key: 'createClosure',
	        value: function createClosure(func, config) {
	            return function (data) {
	                return func(config, data);
	            };
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

	            if (typeof eventType !== 'string') {
	                throw new _error2.default('subscribeEvent: eventType is not defined.');
	            }

	            if (typeof subscriber !== 'function') {
	                throw new _error2.default('subscribeEvent: subscriber function is not defined.');
	            }

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
	            if (typeof eventType !== 'string') {
	                throw new _error2.default('postEvent: eventType is not defined.');
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

	    }, {
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            var eventType = arguments.length <= 3 || arguments[3] === undefined ? 'update' : arguments[3];
	            var once = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

	            if (!owner || !key || !subscriber) {
	                throw new _error2.default('subscribe: can\'t subscribe variable without owner, key or callback function.');
	            }
	            var uid = this.utils.createKeyUID(owner, key);
	            var availableEvents = ['will-change', 'update'];
	            var eventToListen = availableEvents.indexOf(eventType) !== -1 && eventType;
	            var eventHandler = function eventHandler(config) {
	                if (config.uid === uid) {
	                    subscriber(config);
	                }
	            };

	            if (!eventToListen) {
	                throw new _error2.default('subscribe: listening ' + eventType + ' event is not accepted.');
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
	            var dependenciesArray = Array.from(dependencies);
	            var index = 0;
	            var dependency = undefined;

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

	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(context, computed, callback) {
	            if (!context || !computed || !callback) {
	                throw new _error2.default('getDependencies: there is no context, computed function or callback.');
	            }

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
	         * @param {Boolean} async
	         */

	    }, {
	        key: 'addToStack',
	        value: function addToStack(owner, key, callback) {
	            var _this3 = this;

	            var async = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	            var uid = this.utils.createKeyUID(owner, key);

	            this.postEvent('will-change', {
	                uid: uid,
	                type: 'computed'
	            });

	            var promise = async ? callback : new Promise(function (resolve) {
	                _this3.subscribeEvent('will-change-all', function () {
	                    resolve(callback());
	                }, true);
	            });

	            this._callstack.set(uid, promise.then(function () {
	                _this3._callstack.delete(uid);
	                if (!_this3._callstack.size) {
	                    _this3.postEvent('change-complete');
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

	    }, {
	        key: 'variable',
	        value: function variable(owner, key, initialValue) {
	            if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) !== 'object') {
	                throw new _error2.default('variable: owner object in not defined.');
	            }
	            if (typeof key !== 'string') {
	                throw new _error2.default('variable: key string in not defined.');
	            }

	            var uid = this.utils.createKeyUID(owner, key);

	            if (this._variables.has(uid)) {
	                return initialValue;
	            }

	            var value = initialValue;
	            var closure = {
	                uid: uid,
	                owner: owner,
	                key: key,
	                getValue: function getValue() {
	                    return value;
	                },
	                setValue: function setValue(newValue) {
	                    return value = newValue;
	                }
	            };

	            this._variables.set(uid, new Set());

	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.variable.get, closure),
	                set: this.createClosure(this._watchers.variable.set, closure)
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
	            var _this4 = this;

	            if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) !== 'object') {
	                throw new _error2.default('computed: owner object in not defined.');
	            }

	            if (typeof key !== 'string') {
	                throw new _error2.default('computed: key string in not defined.');
	            }

	            if (typeof computedObservable !== 'function') {
	                throw new _error2.default('computed: computedObservable function in not defined.');
	            }

	            var uid = this.utils.createKeyUID(owner, key);

	            if (this._variables.has(uid)) {
	                return computedObservable;
	            }

	            var latestValue = undefined;
	            var _isComputing = false;
	            var dependencies = new Set();
	            var handlers = new Set();
	            var closure = {
	                uid: uid,
	                owner: owner,
	                key: key,
	                setValue: function setValue(newValue) {
	                    return latestValue = newValue;
	                },
	                getValue: function getValue() {
	                    return latestValue;
	                },
	                isComputing: function isComputing() {
	                    return _isComputing;
	                },
	                setIsComputing: function setIsComputing(value) {
	                    return _isComputing = value;
	                }
	            };

	            this._variables.set(uid, handlers);

	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.computed.get, closure),
	                set: this.createClosure(this._watchers.computed.set, closure)
	            });

	            var handleObservable = function handleObservable(handledValue) {
	                dependencies.add(handledValue.uid);

	                var subscriber = _this4.subscribe(handledValue.owner, handledValue.key, function () {
	                    if (_isComputing) {
	                        return false;
	                    }

	                    _isComputing = true;

	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            return computedObservable.call(owner);
	                        }).then(function (value) {
	                            owner[key] = value;
	                        }).catch(function () {
	                            owner[key] = undefined;
	                        });
	                    });
	                }, 'will-change');

	                handlers.add(subscriber);
	            };

	            if (userDependencies) {
	                for (var userDependency in userDependencies) {
	                    if (!userDependencies.hasOwnProperty(userDependency)) {
	                        continue;
	                    }

	                    handleObservable(userDependency);
	                }
	            }

	            var calculatedValue = this.getDependencies(owner, computedObservable, handleObservable);
	            if (calculatedValue instanceof Promise) {
	                this.addToStack(owner, key, calculatedValue.then(function (result) {
	                    _isComputing = true;
	                    owner[key] = result;
	                }), true);
	            } else {
	                _isComputing = true;
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

	    }, {
	        key: 'array',
	        value: function array(owner, key, initialArray) {
	            var uid = this.utils.createKeyUID(owner, key);

	            owner[key] = new _array2.default(uid, owner, key, this.eventStream, initialArray);
	        }

	        /**
	         * @name Baxter.watch
	         * @param {Object} object
	         */

	    }, {
	        key: 'watch',
	        value: function watch(object) {
	            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
	                throw new _error2.default('watch: object is not defined.');
	            }

	            var computedVariables = [];

	            for (var key in object) {
	                if (!object.hasOwnProperty(key)) {
	                    continue;
	                }

	                var value = object[key];

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

	            for (var index = 0, computedLength = computedVariables.length; index < computedLength; index++) {
	                var computed = computedVariables[index];
	                this.computed(computed.owner, computed.key, computed.value);
	            }

	            return object;
	        }

	        /**
	         * @name Baxter.dispose
	         * @param {Object} owner
	         * @param {String} [key]
	         */

	    }, {
	        key: 'dispose',
	        value: function dispose(owner, key) {
	            if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) !== 'object') {
	                throw new _error2.default('Dispose: object is not defined.');
	            }

	            if (!key) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = Object.keys(owner)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var field = _step.value;

	                        var uid = this.utils.createKeyUID(owner, field);
	                        var handlers = this._variables.get(uid);

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
	                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                    _iterator2.return();
	                                }
	                            } finally {
	                                if (_didIteratorError2) {
	                                    throw _iteratorError2;
	                                }
	                            }
	                        }

	                        this._variables.delete(uid);
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator.return) {
	                            _iterator.return();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }
	            } else {
	                var uid = this.utils.createKeyUID(owner, key);
	                var handlers = this._variables.get(uid);

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
	                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                            _iterator3.return();
	                        }
	                    } finally {
	                        if (_didIteratorError3) {
	                            throw _iteratorError3;
	                        }
	                    }
	                }

	                this._variables.delete(uid);
	            }
	        }
	    }]);

	    return Baxter;
	}();

	exports.default = new Baxter();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class EventService
	 */

	var EventService = function () {
	    function EventService(customContext) {
	        _classCallCheck(this, EventService);

	        /**
	         * @name EventService._channels
	         * @type {Object}
	         * @private
	         */
	        this._channels = {};

	        /**
	         * @name EventService.context
	         * @type {Object}
	         */
	        this.context = customContext || this;
	    }

	    /**
	     * @name EventService.getEvent
	     * @param {String} event
	     * @returns {Set}
	     */

	    _createClass(EventService, [{
	        key: "getEvent",
	        value: function getEvent(event) {
	            if (!(event in this._channels)) {
	                return this._channels[event] = new Set();
	            }

	            return this._channels[event];
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
	                return delete this._channels[event];
	            }

	            var eventHandlers = this._channels[event];

	            eventHandlers.delete(handlerToDelete);

	            if (!eventHandlers.size) {
	                delete this._channels[event];
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

	            if (!(event in this._channels)) {
	                return false;
	            }

	            var eventHandlers = Array.from(this._channels[event]);
	            var index = 0,
	                size = eventHandlers.length;

	            for (index; index < size; index++) {
	                eventHandlers[index].call(this.context, data);
	            }
	        }
	    }]);

	    return EventService;
	}();

	exports.default = EventService;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * @name BaxterError
	 */

	var BaxterError = function (_Error) {
	    _inherits(BaxterError, _Error);

	    function BaxterError(message) {
	        _classCallCheck(this, BaxterError);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaxterError).call(this));

	        _this.message = '[Baxter.js]: ' + message;
	        return _this;
	    }

	    return BaxterError;
	}(Error);

	exports.default = BaxterError;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var methods = ['push', 'shift', 'join', 'concat', 'pop', 'unshift', 'slice', 'reverse', 'sort', 'splice'];

	var ObservableArray = function ObservableArray(uid, owner, key, eventStream, initialArray) {
	    this.uid = uid;
	    this.owner = owner;
	    this.key = key;
	    this.eventStream = eventStream;
	};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	    var _loop = function _loop() {
	        var method = _step.value;

	        ObservableArray.prototype[method] = function () {
	            var value = Array.prototype[method].apply(this, arguments);

	            this.eventStream.post('update', {
	                uid: this.uid,
	                owner: this.owner,
	                key: this.key,
	                value: this
	            });

	            return value;
	        };
	    };

	    for (var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        _loop();
	    }
	} catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	        }
	    } finally {
	        if (_didIteratorError) {
	            throw _iteratorError;
	        }
	    }
	}

	exports.default = ObservableArray;

/***/ }
/******/ ]);