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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _error = __webpack_require__(3);
	
	var _error2 = _interopRequireDefault(_error);
	
	var _array = __webpack_require__(4);
	
	var _array2 = _interopRequireDefault(_array);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @description Map of lib errors
	 * @type {Object.<String>}
	 */
	var ERROR = {
	    MUST_BE_DEFINED: 'variables must be defined',
	    NO_SETTER_TO_COMPUTED: 'you can\'t set value to computed variable',
	    PLUGIN_NAME_RESERVED: function PLUGIN_NAME_RESERVED(plugin) {
	        return 'name ' + plugin + ' is already reserved. Try to rename your plugin';
	    },
	    WRONG_EVENT: function WRONG_EVENT(eventType) {
	        return 'listening ' + eventType + ' event is not accepted';
	    },
	    IS_NOT_A_STRING: function IS_NOT_A_STRING(variable) {
	        return 'variable must be a string: ' + (typeof variable === 'undefined' ? 'undefined' : _typeof(variable)) + ' ' + variable;
	    },
	    IS_NOT_A_FUNCTION: function IS_NOT_A_FUNCTION(variable) {
	        return 'variable must be a function: ' + (typeof variable === 'undefined' ? 'undefined' : _typeof(variable)) + ' ' + variable;
	    },
	    IS_NOT_AN_OBJECT: function IS_NOT_AN_OBJECT(variable) {
	        return 'variable must be an object: ' + (typeof variable === 'undefined' ? 'undefined' : _typeof(variable)) + ' ' + variable;
	    }
	};
	
	/**
	 * @description List of reserved names
	 * @type {Array.<String>}
	 */
	var EXPECTED_NAMES = ['_callstack', '_variables', '_watchers', 'eventStream', 'utils', 'plugin', 'createClosure', 'subscribeEvent', 'subscribe', 'postEvent', 'resolve', 'getDependencies', 'addToStack', 'variable', 'computed', 'watch', 'dispose'];
	
	/**
	 * @description Field name for object uid
	 * @type {String}
	 */
	var UID_FIELD = '__uid__';
	
	/**
	 * @description Basic unique id, other uids are incremented from this
	 * @type {Number}
	 */
	var uid = 1;
	
	/**
	 * @class Baxter
	 * @description Main class, provides library as it self.
	 */
	
	var Baxter = function () {
	    /**
	     * @param {EventService} EventService
	     */
	
	    function Baxter(EventService) {
	        var _this = this;
	
	        _classCallCheck(this, Baxter);
	
	        /**
	         * @name Baxter#_callstack
	         * @type {Map.<Promise>}
	         * @private
	         * @description Callstack is a map if promises, that Baxter must resolve.
	         */
	        this._callstack = new Map();
	
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
	            createObjectUID: function createObjectUID(object) {
	                var currentUID = uid++;
	
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
	            getUIDByObject: function getUIDByObject(object) {
	                if (!object[UID_FIELD]) {
	                    return _this.utils.createObjectUID(object);
	                }
	
	                return object[UID_FIELD];
	            },
	
	            /**
	             * @name Baxter#utils.createKeyUID
	             * @param {Object} owner
	             * @param {String} key
	             * @returns {String}
	             */
	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            }
	        };
	
	        /**
	         * @name Baxter#_watchers
	         * @type {Object}
	         * @private
	         */
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
	                        throw new _error2.default(ERROR.NO_SETTER_TO_COMPUTED);
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
	     * @name Baxter#plugin
	     * @param {String} namespace
	     * @param {*} plugin
	     */
	
	
	    _createClass(Baxter, [{
	        key: 'plugin',
	        value: function plugin(namespace, _plugin) {
	            if (EXPECTED_NAMES.indexOf(namespace) !== -1) {
	                throw new _error2.default(ERROR.PLUGIN_NAME_RESERVED(namespace));
	            }
	
	            return this[namespace] = _plugin;
	        }
	
	        /**
	         * @name Baxter#createClosure
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
	         * @name Baxter#subscribeEvent
	         * @param {String} eventType
	         * @param {Function} subscriber
	         * @param {Boolean} [once=false]
	         */
	
	    }, {
	        key: 'subscribeEvent',
	        value: function subscribeEvent(eventType, subscriber) {
	            var _this2 = this;
	
	            var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	            if (typeof eventType !== 'string') {
	                throw new _error2.default(ERROR.IS_NOT_A_STRING(eventType));
	            }
	
	            if (typeof subscriber !== 'function') {
	                throw new _error2.default(ERROR.IS_NOT_A_FUNCTION(subscriber));
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
	         * @name Baxter#postEvent
	         * @param {String} eventType
	         * @param {*} [data]
	         */
	
	    }, {
	        key: 'postEvent',
	        value: function postEvent(eventType, data) {
	            if (typeof eventType !== 'string') {
	                throw new _error2.default(ERROR.IS_NOT_A_STRING(eventType));
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
	
	    }, {
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            var eventType = arguments.length <= 3 || arguments[3] === undefined ? 'update' : arguments[3];
	            var once = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
	            if (!owner || !key || !subscriber) {
	                throw new _error2.default(ERROR.MUST_BE_DEFINED);
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
	                throw new _error2.default(ERROR.WRONG_EVENT(eventType));
	            }
	
	            return this.subscribeEvent(eventToListen, eventHandler, once);
	        }
	
	        /**
	         * @name Baxter#resolve
	         * @param {Set} dependencies
	         * @returns {Promise}
	         */
	
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            var result = new Set();
	            var dependenciesArray = Array.from(dependencies);
	            var index = 0;
	            var dependency = void 0;
	
	            for (index; index < dependenciesArray.length; index++) {
	                dependency = dependenciesArray[index];
	
	                result.add(this._callstack.get(dependency));
	            }
	
	            return Promise.all(result);
	        }
	
	        /**
	         * @name Baxter#getDependencies
	         * @param {Object} context
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {*} Result of computing
	         */
	
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(context, computed, callback) {
	            if (!context || !computed || !callback) {
	                throw new _error2.default(ERROR.MUST_BE_DEFINED);
	            }
	
	            var listener = this.subscribeEvent('get', callback);
	            var computingResult = computed.call(context);
	
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
	
	    }, {
	        key: 'addToStack',
	        value: function addToStack(owner, key, callback) {
	            var _this3 = this;
	
	            var async = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	            var uid = this.utils.createKeyUID(owner, key);
	            var promise = void 0;
	
	            this.postEvent('will-change', {
	                uid: uid,
	                type: 'computed'
	            });
	
	            if (async) {
	                promise = callback;
	            } else {
	                promise = new Promise(function (resolve) {
	                    _this3.subscribeEvent('will-change-all', function () {
	                        resolve(callback());
	                    }, true);
	                });
	            }
	
	            this._callstack.set(uid, promise.then(function () {
	                _this3._callstack.delete(uid);
	                if (!_this3._callstack.size) {
	                    _this3.postEvent('change-complete');
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
	
	    }, {
	        key: 'variable',
	        value: function variable(owner, key, initialValue) {
	            if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) !== 'object') {
	                throw new _error2.default(ERROR.IS_NOT_AN_OBJECT(owner));
	            }
	            if (typeof key !== 'string') {
	                throw new _error2.default(ERROR.IS_NOT_A_STRING(key));
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
	         * @name Baxter#computed
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
	                throw new _error2.default(ERROR.IS_NOT_AN_OBJECT(owner));
	            }
	
	            if (typeof key !== 'string') {
	                throw new _error2.default(ERROR.IS_NOT_A_STRING(key));
	            }
	
	            if (typeof computedObservable !== 'function') {
	                throw new _error2.default(ERROR.IS_NOT_A_FUNCTION(computedObservable));
	            }
	
	            var uid = this.utils.createKeyUID(owner, key);
	
	            if (this._variables.has(uid)) {
	                return computedObservable;
	            }
	
	            var latestValue = void 0;
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
	                    /**
	                     * FIXME: bug, after batch of changed isComputing stays true.
	                     */
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
	         * @name Baxter#array
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
	         * @name Baxter#watch
	         * @param {Object} object
	         */
	
	    }, {
	        key: 'watch',
	        value: function watch(object) {
	            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
	                throw new _error2.default(ERROR.IS_NOT_AN_OBJECT(object));
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
	         * @name Baxter#dispose
	         * @param {Object} owner
	         * @param {String} [key]
	         */
	
	    }, {
	        key: 'dispose',
	        value: function dispose(owner, key) {
	            if ((typeof owner === 'undefined' ? 'undefined' : _typeof(owner)) !== 'object') {
	                throw new _error2.default(ERROR.IS_NOT_AN_OBJECT(owner));
	            }
	
	            if (!key) {
	                var ownerKeys = Object.keys(owner);
	                var ownerKeyIndex = 0,
	                    field = void 0,
	                    _uid = void 0,
	                    handlers = void 0,
	                    handlersArray = void 0,
	                    handlerIndex = void 0;
	
	                for (ownerKeyIndex; ownerKeyIndex < ownerKeys.length; ownerKeyIndex++) {
	                    field = ownerKeys[ownerKeyIndex];
	
	                    _uid = this.utils.createKeyUID(owner, field);
	                    handlers = this._variables.get(_uid);
	
	                    if (!handlers) {
	                        continue;
	                    }
	
	                    handlersArray = Array.from(handlers);
	                    handlerIndex = 0;
	
	                    for (handlerIndex; handlerIndex < handlersArray.length; handlerIndex++) {
	                        handlersArray[handlerIndex].dispose();
	                        delete owner[field];
	                    }
	
	                    this._variables.delete(_uid);
	                }
	            } else {
	                var _uid2 = this.utils.createKeyUID(owner, key);
	                var _handlers = this._variables.get(_uid2);
	
	                if (!_handlers) {
	                    return;
	                }
	
	                var _handlersArray = Array.from(_handlers);
	                var index = 0;
	
	                for (index; index < _handlersArray.length; index++) {
	                    _handlersArray[index].dispose();
	                    delete owner[key];
	                }
	
	                this._variables.delete(_uid2);
	            }
	        }
	    }]);
	
	    return Baxter;
	}();
	
	exports.default = new Baxter(_event2.default);

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERROR = {
	    NO_INIT_PARAMETERS: "Can't init event listener: no parameters given",
	    NO_EVENT: "Event is undefined. Must be a String"
	};
	
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
	         * @param {String} event - Event name
	         * @param {Function} handler - Callback function with data as argument
	         */
	
	    }, {
	        key: "on",
	        value: function on(event, handler) {
	            if (!event || !handler) {
	                throw new Error(ERROR.NO_INIT_PARAMETERS);
	            }
	
	            this.getEvent(event).add(handler);
	        }
	
	        /**
	         * @name EventService.once
	         * @param {String} event
	         * @param {Function} handler
	         */
	
	    }, {
	        key: "once",
	        value: function once(event, handler) {
	            if (!event || !handler) {
	                throw new Error(ERROR.NO_INIT_PARAMETERS);
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
	         * @param {String} event
	         * @param {Function} [handlerToDelete]
	         * @returns {Boolean}
	         */
	
	    }, {
	        key: "off",
	        value: function off(event, handlerToDelete) {
	            if (!event) {
	                throw new Error(ERROR.NO_EVENT);
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
	         * @param {String} event
	         * @param {*} data
	         */
	
	    }, {
	        key: "post",
	        value: function post(event, data) {
	            if (!event) {
	                throw new Error(ERROR.NO_EVENT);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODVkY2E2NzUwMjdjZTIxYTEyZjciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9lcnJvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvYXJyYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7O0FBRUEsRUFBQyxVQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksY0FBWixFQUErQjtBQUM1QixTQUFJLGNBQUosRUFBb0I7QUFDaEIsd0JBQWUsSUFBZixJQUF1QixHQUF2QixDQURnQjtNQUFwQixNQUdBLElBQUksTUFBZ0M7QUFDaEMsYUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBTyxPQUFQLEVBQWdCO0FBQ2pELHVCQUFVLE9BQU8sT0FBUCxHQUFpQixHQUFqQixDQUR1QztVQUFyRDtBQUdBLGlCQUFRLElBQVIsSUFBZ0IsR0FBaEIsQ0FKZ0M7TUFBcEM7RUFKSCxDQUFELENBVUcsUUFWSCxvQkFVcUIsTUFWckIsRTs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBTUEsS0FBTSxRQUFRO0FBQ1YsaURBRFU7QUFFVix1RUFGVTtBQUdWLDJCQUFzQiw4QkFBQyxNQUFEOzBCQUFvQjtNQUFwQjtBQUN0QixrQkFBYSxxQkFBQyxTQUFEOytCQUE0QjtNQUE1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S0FBSyxHQUFMO0FBQ0wsd0JBQU8sSUFBUDtjQUpKLEVBSDJDOztBQVUzQyxvQkFBTyxLQUFQLENBVjJDO1VBQVg7OztBQUR4QywwQkFBbUIsaUNBQW5CLG9HQUE0Qjs7TUFBNUI7Ozs7Ozs7Ozs7Ozs7Ozs7bUJBaUJlLGdCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA4NWRjYTY3NTAyN2NlMjFhMTJmN1xuICoqLyIsImltcG9ydCBiYXh0ZXIgZnJvbSAnLi9iYXh0ZXInO1xuXG4oKG5hbWUsIGxpYiwgYnJvd3NlckNvbnRleHQpID0+IHtcbiAgICBpZiAoYnJvd3NlckNvbnRleHQpIHtcbiAgICAgICAgYnJvd3NlckNvbnRleHRbbmFtZV0gPSBsaWI7XG4gICAgfSBlbHNlXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGxpYjtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzW25hbWVdID0gbGliO1xuICAgIH1cbn0pKCdiYXh0ZXInLCBiYXh0ZXIsIHdpbmRvdyk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbmRleC5qc1xuICoqLyIsImltcG9ydCBFdmVudFNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9ldmVudCc7XG5pbXBvcnQgQmF4dGVyRXJyb3IgZnJvbSAnLi9lbnRpdGllcy9lcnJvcic7XG5pbXBvcnQgT2JzZXJ2YWJsZUFycmF5IGZyb20gJy4vZW50aXRpZXMvYXJyYXknO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNYXAgb2YgbGliIGVycm9yc1xuICogQHR5cGUge09iamVjdC48U3RyaW5nPn1cbiAqL1xuY29uc3QgRVJST1IgPSB7XG4gICAgTVVTVF9CRV9ERUZJTkVEOiBgdmFyaWFibGVzIG11c3QgYmUgZGVmaW5lZGAsXG4gICAgTk9fU0VUVEVSX1RPX0NPTVBVVEVEOiBgeW91IGNhbid0IHNldCB2YWx1ZSB0byBjb21wdXRlZCB2YXJpYWJsZWAsXG4gICAgUExVR0lOX05BTUVfUkVTRVJWRUQ6IChwbHVnaW4pID0+IGBuYW1lICR7cGx1Z2lufSBpcyBhbHJlYWR5IHJlc2VydmVkLiBUcnkgdG8gcmVuYW1lIHlvdXIgcGx1Z2luYCxcbiAgICBXUk9OR19FVkVOVDogKGV2ZW50VHlwZSkgPT4gYGxpc3RlbmluZyAke2V2ZW50VHlwZX0gZXZlbnQgaXMgbm90IGFjY2VwdGVkYCxcbiAgICBJU19OT1RfQV9TVFJJTkc6ICh2YXJpYWJsZSkgPT4gYHZhcmlhYmxlIG11c3QgYmUgYSBzdHJpbmc6ICR7dHlwZW9mIHZhcmlhYmxlfSAke3ZhcmlhYmxlfWAsXG4gICAgSVNfTk9UX0FfRlVOQ1RJT046ICh2YXJpYWJsZSkgPT4gYHZhcmlhYmxlIG11c3QgYmUgYSBmdW5jdGlvbjogJHt0eXBlb2YgdmFyaWFibGV9ICR7dmFyaWFibGV9YCxcbiAgICBJU19OT1RfQU5fT0JKRUNUOiAodmFyaWFibGUpID0+IGB2YXJpYWJsZSBtdXN0IGJlIGFuIG9iamVjdDogJHt0eXBlb2YgdmFyaWFibGV9ICR7dmFyaWFibGV9YFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gTGlzdCBvZiByZXNlcnZlZCBuYW1lc1xuICogQHR5cGUge0FycmF5LjxTdHJpbmc+fVxuICovXG5jb25zdCBFWFBFQ1RFRF9OQU1FUyA9IFtcbiAgICAnX2NhbGxzdGFjaycsXG4gICAgJ192YXJpYWJsZXMnLFxuICAgICdfd2F0Y2hlcnMnLFxuICAgICdldmVudFN0cmVhbScsXG4gICAgJ3V0aWxzJyxcbiAgICAncGx1Z2luJyxcbiAgICAnY3JlYXRlQ2xvc3VyZScsXG4gICAgJ3N1YnNjcmliZUV2ZW50JyxcbiAgICAnc3Vic2NyaWJlJyxcbiAgICAncG9zdEV2ZW50JyxcbiAgICAncmVzb2x2ZScsXG4gICAgJ2dldERlcGVuZGVuY2llcycsXG4gICAgJ2FkZFRvU3RhY2snLFxuICAgICd2YXJpYWJsZScsXG4gICAgJ2NvbXB1dGVkJyxcbiAgICAnd2F0Y2gnLFxuICAgICdkaXNwb3NlJ1xuXTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRmllbGQgbmFtZSBmb3Igb2JqZWN0IHVpZFxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuY29uc3QgVUlEX0ZJRUxEID0gJ19fdWlkX18nO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBCYXNpYyB1bmlxdWUgaWQsIG90aGVyIHVpZHMgYXJlIGluY3JlbWVudGVkIGZyb20gdGhpc1xuICogQHR5cGUge051bWJlcn1cbiAqL1xubGV0IHVpZCA9IDE7XG5cblxuLyoqXG4gKiBAY2xhc3MgQmF4dGVyXG4gKiBAZGVzY3JpcHRpb24gTWFpbiBjbGFzcywgcHJvdmlkZXMgbGlicmFyeSBhcyBpdCBzZWxmLlxuICovXG5jbGFzcyBCYXh0ZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RXZlbnRTZXJ2aWNlfSBFdmVudFNlcnZpY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihFdmVudFNlcnZpY2UpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlciNfY2FsbHN0YWNrXG4gICAgICAgICAqIEB0eXBlIHtNYXAuPFByb21pc2U+fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQ2FsbHN0YWNrIGlzIGEgbWFwIGlmIHByb21pc2VzLCB0aGF0IEJheHRlciBtdXN0IHJlc29sdmUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jYWxsc3RhY2sgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlciNfdmFyaWFibGVzXG4gICAgICAgICAqIEB0eXBlIHtNYXAuPFNldD59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBoYW5kbGVzIGFsbCBzdWJzY3JpcHRpb25zIGZvciBwcm9wZXJ0eSBvYmplY3QgZGlzcG9zaW5nXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl92YXJpYWJsZXMgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlciNldmVudFN0cmVhbVxuICAgICAgICAgKiBAdHlwZSB7RXZlbnRTZXJ2aWNlfVxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gUHJvdmlkZXMgZXZlbnRzIHNlcnZpY2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0gPSBuZXcgRXZlbnRTZXJ2aWNlKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBCYXh0ZXIjdXRpbHNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudXRpbHMgPSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlciN1dGlscy5jcmVhdGVPYmplY3RVSURcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNyZWF0ZU9iamVjdFVJRDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VUlEID0gdWlkKys7XG5cbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBVSURfRklFTEQsIHtcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjdXJyZW50VUlEXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFVJRDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyI3V0aWxzLmdldFVJREJ5T2JqZWN0XG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0VUlEQnlPYmplY3Q6IChvYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIW9iamVjdFtVSURfRklFTERdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmNyZWF0ZU9iamVjdFVJRChvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RbVUlEX0ZJRUxEXTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyI3V0aWxzLmNyZWF0ZUtleVVJRFxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjcmVhdGVLZXlVSUQ6IChvd25lciwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuZ2V0VUlEQnlPYmplY3Qob3duZXIpICsgJzonICsga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBCYXh0ZXIjX3dhdGNoZXJzXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl93YXRjaGVycyA9IHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNvbmZpZy5nZXRWYWx1ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCdnZXQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHNldDogKGNvbmZpZywgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gY29uZmlnLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3dpbGwtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiBjb25maWcudWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhcmlhYmxlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcuc2V0VmFsdWUobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCd3aWxsLWNoYW5nZS1hbGwnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogY29uZmlnLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBjb25maWcub3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgICAgICBnZXQ6IChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gY29uZmlnLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogY29uZmlnLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBjb25maWcub3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzZXQ6IChjb25maWcsIGNvbXB1dGVkUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZSA9IGNvbmZpZy5nZXRWYWx1ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY29uZmlnLmlzQ29tcHV0aW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5OT19TRVRURVJfVE9fQ09NUFVURUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkUmVzdWx0ID09PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnNldElzQ29tcHV0aW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnNldFZhbHVlKGNvbXB1dGVkUmVzdWx0KTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbXB1dGVkUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIjcGx1Z2luXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICAgICAqIEBwYXJhbSB7Kn0gcGx1Z2luXG4gICAgICovXG4gICAgcGx1Z2luKG5hbWVzcGFjZSwgcGx1Z2luKSB7XG4gICAgICAgIGlmIChFWFBFQ1RFRF9OQU1FUy5pbmRleE9mKG5hbWVzcGFjZSkgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuUExVR0lOX05BTUVfUkVTRVJWRUQobmFtZXNwYWNlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpc1tuYW1lc3BhY2VdID0gcGx1Z2luO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciNjcmVhdGVDbG9zdXJlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY1xuICAgICAqIEBwYXJhbSB7Kn0gY29uZmlnXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGNyZWF0ZUNsb3N1cmUoZnVuYywgY29uZmlnKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4gZnVuYyhjb25maWcsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciNzdWJzY3JpYmVFdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmVyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZT1mYWxzZV1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVFdmVudChldmVudFR5cGUsIHN1YnNjcmliZXIsIG9uY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIGV2ZW50VHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5JU19OT1RfQV9TVFJJTkcoZXZlbnRUeXBlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5JU19OT1RfQV9GVU5DVElPTihzdWJzY3JpYmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5vbmNlKGV2ZW50VHlwZSwgc3Vic2NyaWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLm9uKGV2ZW50VHlwZSwgc3Vic2NyaWJlcik7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGlzcG9zZTogKCkgPT4gdGhpcy5ldmVudFN0cmVhbS5vZmYoZXZlbnRUeXBlLCBzdWJzY3JpYmVyKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciNwb3N0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gICAgICogQHBhcmFtIHsqfSBbZGF0YV1cbiAgICAgKi9cbiAgICBwb3N0RXZlbnQoZXZlbnRUeXBlLCBkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnRUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKEVSUk9SLklTX05PVF9BX1NUUklORyhldmVudFR5cGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdChldmVudFR5cGUsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciNzdWJzY3JpYmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRUeXBlXVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2VdXG4gICAgICogQHRocm93cyB7QmF4dGVyRXJyb3J9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKG93bmVyLCBrZXksIHN1YnNjcmliZXIsIGV2ZW50VHlwZSA9ICd1cGRhdGUnLCBvbmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFvd25lciB8fCAha2V5IHx8ICFzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuTVVTVF9CRV9ERUZJTkVEKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgIGxldCBhdmFpbGFibGVFdmVudHMgPSBbJ3dpbGwtY2hhbmdlJywgJ3VwZGF0ZSddO1xuICAgICAgICBsZXQgZXZlbnRUb0xpc3RlbiA9IGF2YWlsYWJsZUV2ZW50cy5pbmRleE9mKGV2ZW50VHlwZSkgIT09IC0xICYmIGV2ZW50VHlwZTtcbiAgICAgICAgbGV0IGV2ZW50SGFuZGxlciA9IChjb25maWcpID0+IHtcbiAgICAgICAgICAgIGlmIChjb25maWcudWlkID09PSB1aWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFldmVudFRvTGlzdGVuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuV1JPTkdfRVZFTlQoZXZlbnRUeXBlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVFdmVudChldmVudFRvTGlzdGVuLCBldmVudEhhbmRsZXIsIG9uY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciNyZXNvbHZlXG4gICAgICogQHBhcmFtIHtTZXR9IGRlcGVuZGVuY2llc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHJlc29sdmUoZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCBkZXBlbmRlbmNpZXNBcnJheSA9IEFycmF5LmZyb20oZGVwZW5kZW5jaWVzKTtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgbGV0IGRlcGVuZGVuY3k7XG5cbiAgICAgICAgZm9yIChpbmRleDsgaW5kZXggPCBkZXBlbmRlbmNpZXNBcnJheS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGRlcGVuZGVuY3kgPSBkZXBlbmRlbmNpZXNBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIHJlc3VsdC5hZGQodGhpcy5fY2FsbHN0YWNrLmdldChkZXBlbmRlbmN5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIjZ2V0RGVwZW5kZW5jaWVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wdXRlZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMgeyp9IFJlc3VsdCBvZiBjb21wdXRpbmdcbiAgICAgKi9cbiAgICBnZXREZXBlbmRlbmNpZXMoY29udGV4dCwgY29tcHV0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY29udGV4dCB8fCAhY29tcHV0ZWQgfHwgIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuTVVTVF9CRV9ERUZJTkVEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsaXN0ZW5lciA9IHRoaXMuc3Vic2NyaWJlRXZlbnQoJ2dldCcsIGNhbGxiYWNrKTtcbiAgICAgICAgbGV0IGNvbXB1dGluZ1Jlc3VsdCA9IGNvbXB1dGVkLmNhbGwoY29udGV4dCk7XG5cbiAgICAgICAgbGlzdGVuZXIuZGlzcG9zZSgpO1xuXG4gICAgICAgIHJldHVybiBjb21wdXRpbmdSZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyI2FkZFRvU3RhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxQcm9taXNlfSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FzeW5jPWZhbHNlXVxuICAgICAqL1xuICAgIGFkZFRvU3RhY2sob3duZXIsIGtleSwgY2FsbGJhY2ssIGFzeW5jID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuICAgICAgICBsZXQgcHJvbWlzZTtcblxuICAgICAgICB0aGlzLnBvc3RFdmVudCgnd2lsbC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIHR5cGU6ICdjb21wdXRlZCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICBwcm9taXNlID0gY2FsbGJhY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZUV2ZW50KCd3aWxsLWNoYW5nZS1hbGwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2FsbGJhY2soKSk7XG4gICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NhbGxzdGFjay5zZXQodWlkLCBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2FsbHN0YWNrLmRlbGV0ZSh1aWQpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9jYWxsc3RhY2suc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCdjaGFuZ2UtY29tcGxldGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlciN2YXJpYWJsZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdXG4gICAgICogQHJldHVybnMgeyp9IGluaXRpYWxWYWx1ZVxuICAgICAqL1xuICAgIHZhcmlhYmxlKG93bmVyLCBrZXksIGluaXRpYWxWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG93bmVyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKEVSUk9SLklTX05PVF9BTl9PQkpFQ1Qob3duZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5JU19OT1RfQV9TVFJJTkcoa2V5KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3ZhcmlhYmxlcy5oYXModWlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICAgICAgbGV0IGNsb3N1cmUgPSB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgZ2V0VmFsdWU6ICgpID0+IHZhbHVlLFxuICAgICAgICAgICAgc2V0VmFsdWU6IChuZXdWYWx1ZSkgPT4gdmFsdWUgPSBuZXdWYWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3ZhcmlhYmxlcy5zZXQodWlkLCBuZXcgU2V0KCkpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvd25lciwga2V5LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQ6IHRoaXMuY3JlYXRlQ2xvc3VyZSh0aGlzLl93YXRjaGVycy52YXJpYWJsZS5nZXQsIGNsb3N1cmUpLFxuICAgICAgICAgICAgICAgIHNldDogdGhpcy5jcmVhdGVDbG9zdXJlKHRoaXMuX3dhdGNoZXJzLnZhcmlhYmxlLnNldCwgY2xvc3VyZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyI2NvbXB1dGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkT2JzZXJ2YWJsZVxuICAgICAqIEBwYXJhbSB7U2V0fE1hcHxBcnJheX0gW3VzZXJEZXBlbmRlbmNpZXNdXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29tcHV0ZWQob3duZXIsIGtleSwgY29tcHV0ZWRPYnNlcnZhYmxlLCB1c2VyRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3duZXIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuSVNfTk9UX0FOX09CSkVDVChvd25lcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoRVJST1IuSVNfTk9UX0FfU1RSSU5HKGtleSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wdXRlZE9ic2VydmFibGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5JU19OT1RfQV9GVU5DVElPTihjb21wdXRlZE9ic2VydmFibGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcblxuICAgICAgICBpZiAodGhpcy5fdmFyaWFibGVzLmhhcyh1aWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRPYnNlcnZhYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxhdGVzdFZhbHVlO1xuICAgICAgICBsZXQgaXNDb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgbGV0IGRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IGhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgY2xvc3VyZSA9IHtcbiAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICBzZXRWYWx1ZTogKG5ld1ZhbHVlKSA9PiBsYXRlc3RWYWx1ZSA9IG5ld1ZhbHVlLFxuICAgICAgICAgICAgZ2V0VmFsdWU6ICgpID0+IGxhdGVzdFZhbHVlLFxuICAgICAgICAgICAgaXNDb21wdXRpbmc6ICgpID0+IGlzQ29tcHV0aW5nLFxuICAgICAgICAgICAgc2V0SXNDb21wdXRpbmc6ICh2YWx1ZSkgPT4gaXNDb21wdXRpbmcgPSB2YWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX3ZhcmlhYmxlcy5zZXQodWlkLCBoYW5kbGVycyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG93bmVyLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogdGhpcy5jcmVhdGVDbG9zdXJlKHRoaXMuX3dhdGNoZXJzLmNvbXB1dGVkLmdldCwgY2xvc3VyZSksXG4gICAgICAgICAgICBzZXQ6IHRoaXMuY3JlYXRlQ2xvc3VyZSh0aGlzLl93YXRjaGVycy5jb21wdXRlZC5zZXQsIGNsb3N1cmUpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBoYW5kbGVPYnNlcnZhYmxlID0gKGhhbmRsZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgZGVwZW5kZW5jaWVzLmFkZChoYW5kbGVkVmFsdWUudWlkKTtcblxuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXIgPSB0aGlzLnN1YnNjcmliZShoYW5kbGVkVmFsdWUub3duZXIsIGhhbmRsZWRWYWx1ZS5rZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBGSVhNRTogYnVnLCBhZnRlciBiYXRjaCBvZiBjaGFuZ2VkIGlzQ29tcHV0aW5nIHN0YXlzIHRydWUuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29tcHV0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU3RhY2sob3duZXIsIGtleSwgKCkgPT4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gY29tcHV0ZWRPYnNlcnZhYmxlLmNhbGwob3duZXIpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sICd3aWxsLWNoYW5nZScpO1xuXG4gICAgICAgICAgICBoYW5kbGVycy5hZGQoc3Vic2NyaWJlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHVzZXJEZXBlbmRlbmN5IGluIHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXJEZXBlbmRlbmNpZXMuaGFzT3duUHJvcGVydHkodXNlckRlcGVuZGVuY3kpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhhbmRsZU9ic2VydmFibGUodXNlckRlcGVuZGVuY3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhbGN1bGF0ZWRWYWx1ZSA9IHRoaXMuZ2V0RGVwZW5kZW5jaWVzKG93bmVyLCBjb21wdXRlZE9ic2VydmFibGUsIGhhbmRsZU9ic2VydmFibGUpO1xuICAgICAgICBpZiAoY2FsY3VsYXRlZFZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKFxuICAgICAgICAgICAgICAgIG93bmVyLFxuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVkVmFsdWUudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlzQ29tcHV0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb3duZXJba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNDb21wdXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgb3duZXJba2V5XSA9IGNhbGN1bGF0ZWRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsYXRlc3RWYWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIjYXJyYXlcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtBcnJheX0gaW5pdGlhbEFycmF5XG4gICAgICovXG4gICAgYXJyYXkob3duZXIsIGtleSwgaW5pdGlhbEFycmF5KSB7XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcblxuICAgICAgICBvd25lcltrZXldID0gbmV3IE9ic2VydmFibGVBcnJheSh1aWQsIG93bmVyLCBrZXksIHRoaXMuZXZlbnRTdHJlYW0sIGluaXRpYWxBcnJheSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyI3dhdGNoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgICAqL1xuICAgIHdhdGNoKG9iamVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcihFUlJPUi5JU19OT1RfQU5fT0JKRUNUKG9iamVjdCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbXB1dGVkVmFyaWFibGVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFyaWFibGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5KG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgY29tcHV0ZWRMZW5ndGggPSBjb21wdXRlZFZhcmlhYmxlcy5sZW5ndGg7IGluZGV4IDwgY29tcHV0ZWRMZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBjb21wdXRlZCA9IGNvbXB1dGVkVmFyaWFibGVzW2luZGV4XTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWQoY29tcHV0ZWQub3duZXIsIGNvbXB1dGVkLmtleSwgY29tcHV0ZWQudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIjZGlzcG9zZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgICAqL1xuICAgIGRpc3Bvc2Uob3duZXIsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIG93bmVyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKEVSUk9SLklTX05PVF9BTl9PQkpFQ1Qob3duZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICBsZXQgb3duZXJLZXlzID0gT2JqZWN0LmtleXMob3duZXIpO1xuICAgICAgICAgICAgbGV0IG93bmVyS2V5SW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIGZpZWxkLCB1aWQsIGhhbmRsZXJzLFxuICAgICAgICAgICAgICAgIGhhbmRsZXJzQXJyYXksIGhhbmRsZXJJbmRleDtcblxuICAgICAgICAgICAgZm9yIChvd25lcktleUluZGV4OyBvd25lcktleUluZGV4IDwgb3duZXJLZXlzLmxlbmd0aDsgb3duZXJLZXlJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgZmllbGQgPSBvd25lcktleXNbb3duZXJLZXlJbmRleF07XG5cbiAgICAgICAgICAgICAgICB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwgZmllbGQpO1xuICAgICAgICAgICAgICAgIGhhbmRsZXJzID0gdGhpcy5fdmFyaWFibGVzLmdldCh1aWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBoYW5kbGVyc0FycmF5ID0gQXJyYXkuZnJvbShoYW5kbGVycyk7XG4gICAgICAgICAgICAgICAgaGFuZGxlckluZGV4ID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAoaGFuZGxlckluZGV4OyBoYW5kbGVySW5kZXggPCBoYW5kbGVyc0FycmF5Lmxlbmd0aDsgaGFuZGxlckluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcnNBcnJheVtoYW5kbGVySW5kZXhdLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG93bmVyW2ZpZWxkXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl92YXJpYWJsZXMuZGVsZXRlKHVpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLl92YXJpYWJsZXMuZ2V0KHVpZCk7XG5cbiAgICAgICAgICAgIGlmICghaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBoYW5kbGVyc0FycmF5ID0gQXJyYXkuZnJvbShoYW5kbGVycyk7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGluZGV4OyBpbmRleCA8IGhhbmRsZXJzQXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNBcnJheVtpbmRleF0uZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvd25lcltrZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl92YXJpYWJsZXMuZGVsZXRlKHVpZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYXh0ZXIoRXZlbnRTZXJ2aWNlKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2JheHRlci5qc1xuICoqLyIsImNvbnN0IEVSUk9SID0ge1xuICAgIE5PX0lOSVRfUEFSQU1FVEVSUzogYENhbid0IGluaXQgZXZlbnQgbGlzdGVuZXI6IG5vIHBhcmFtZXRlcnMgZ2l2ZW5gLFxuICAgIE5PX0VWRU5UOiBgRXZlbnQgaXMgdW5kZWZpbmVkLiBNdXN0IGJlIGEgU3RyaW5nYFxufTtcblxuLyoqXG4gKiBAY2xhc3MgRXZlbnRTZXJ2aWNlXG4gKi9cbmNsYXNzIEV2ZW50U2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoY3VzdG9tQ29udGV4dCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLl9jaGFubmVsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLmNvbnRleHRcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGN1c3RvbUNvbnRleHQgfHwgdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuZ2V0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7U2V0fVxuICAgICAqL1xuICAgIGdldEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuX2NoYW5uZWxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2V2ZW50XSA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tldmVudF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IC0gRXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgLSBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGRhdGEgYXMgYXJndW1lbnRcbiAgICAgKi9cbiAgICBvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgICBpZiAoIWV2ZW50IHx8ICFoYW5kbGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1IuTk9fSU5JVF9QQVJBTUVURVJTKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2V0RXZlbnQoZXZlbnQpLmFkZChoYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub25jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAgICAgKi9cbiAgICBvbmNlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICghZXZlbnQgfHwgIWhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUi5OT19JTklUX1BBUkFNRVRFUlMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZ2V0RXZlbnQoZXZlbnQpLmFkZChoYW5kbGVyV3JhcHBlcik7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlcldyYXBwZXIoZGF0YSkge1xuICAgICAgICAgICAgdGhhdC5vZmYoZXZlbnQsIGhhbmRsZXJXcmFwcGVyKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9mZlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtoYW5kbGVyVG9EZWxldGVdXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICovXG4gICAgb2ZmKGV2ZW50LCBoYW5kbGVyVG9EZWxldGUpIHtcbiAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SLk5PX0VWRU5UKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFuZGxlclRvRGVsZXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2V2ZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBldmVudEhhbmRsZXJzID0gdGhpcy5fY2hhbm5lbHNbZXZlbnRdO1xuXG4gICAgICAgIGV2ZW50SGFuZGxlcnMuZGVsZXRlKGhhbmRsZXJUb0RlbGV0ZSk7XG5cbiAgICAgICAgaWYgKCFldmVudEhhbmRsZXJzLnNpemUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tldmVudF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UucG9zdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YVxuICAgICAqL1xuICAgIHBvc3QoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEVSUk9SLk5PX0VWRU5UKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuX2NoYW5uZWxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGV2ZW50SGFuZGxlcnMgPSBBcnJheS5mcm9tKHRoaXMuX2NoYW5uZWxzW2V2ZW50XSk7XG4gICAgICAgIGxldCBpbmRleCA9IDAsIHNpemUgPSBldmVudEhhbmRsZXJzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGluZGV4OyBpbmRleCA8IHNpemU7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaW5kZXhdLmNhbGwodGhpcy5jb250ZXh0LCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2VydmljZXMvZXZlbnQuanNcbiAqKi8iLCIvKipcbiAqIEBuYW1lIEJheHRlckVycm9yXG4gKi9cbmNsYXNzIEJheHRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnW0JheHRlci5qc106ICcgKyBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmF4dGVyRXJyb3I7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRpdGllcy9lcnJvci5qc1xuICoqLyIsImxldCBtZXRob2RzID0gW1xuICAgICdwdXNoJyxcbiAgICAnc2hpZnQnLFxuICAgICdqb2luJyxcbiAgICAnY29uY2F0JyxcbiAgICAncG9wJyxcbiAgICAndW5zaGlmdCcsXG4gICAgJ3NsaWNlJyxcbiAgICAncmV2ZXJzZScsXG4gICAgJ3NvcnQnLFxuICAgICdzcGxpY2UnXG5dO1xuXG5sZXQgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24odWlkLCBvd25lciwga2V5LCBldmVudFN0cmVhbSwgaW5pdGlhbEFycmF5KSB7XG4gICAgdGhpcy51aWQgPSB1aWQ7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMuZXZlbnRTdHJlYW0gPSBldmVudFN0cmVhbTtcbn07XG5cbmZvciAobGV0IG1ldGhvZCBvZiBtZXRob2RzKSB7XG4gICAgT2JzZXJ2YWJsZUFycmF5LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IEFycmF5LnByb3RvdHlwZVttZXRob2RdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICB1aWQ6IHRoaXMudWlkLFxuICAgICAgICAgICAgb3duZXI6IHRoaXMub3duZXIsXG4gICAgICAgICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBPYnNlcnZhYmxlQXJyYXk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRpdGllcy9hcnJheS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=