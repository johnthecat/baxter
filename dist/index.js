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

	'use strict';
	
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
	
	        this._watchers = {
	            variable: {
	                get: function get(config) {
	                    var value = config.getValue();
	
	                    _this.postEvent('get', {
	                        uid: config.owner,
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
	                        owner: config.owner,
	                        key: config.key
	                    });
	
	                    config.setValue(newValue);
	
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
	                        throw new _entitiesError2['default']('you can\'t set value to computed');
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
	
	        this.subscribeEvent('will-change', this.utils.debounce(function () {
	            return _this.postEvent('will-change-all');
	        }, 0));
	    }
	
	    /**
	     * @name Baxter.createClosure
	     * @param {Function} func
	     * @param {*} config
	     * @returns {Function}
	     */
	
	    _createClass(Baxter, [{
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
	                throw new _entitiesError2['default']('subscribeEvent: eventType is not defined.');
	            }
	
	            if (typeof subscriber !== 'function') {
	                throw new _entitiesError2['default']('subscribeEvent: subscriber function is not defined.');
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
	                throw new _entitiesError2['default']('postEvent: eventType is not defined.');
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
	                throw new _entitiesError2['default']('subscribe: can\'t subscribe variable without owner, key or callback function.');
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
	         * @param {Set|Array} dependencies
	         * @returns {Promise}
	         */
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            if (!(Symbol.iterator in dependencies)) {
	                throw new _entitiesError2['default']('resolve: dependencies are not iterable.');
	            }
	
	            var result = new Set();
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var dependency = _step.value;
	
	                    result.add(this._callstack.get(dependency));
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
	                throw new _entitiesError2['default']('getDependencies: there is no context, computed function or callback.');
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
	
	            this._callstack.set(uid, new Promise(function (resolve) {
	                _this3.subscribeEvent('will-change-all', function () {
	                    resolve(callback());
	                }, true);
	            }).then(function () {
	                _this3._callstack['delete'](uid);
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
	         * @returns {*} value
	         */
	    }, {
	        key: 'variable',
	        value: function variable(owner, key, initialValue) {
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('variable: owner object in not defined.');
	            }
	            if (typeof key !== 'string') {
	                throw new _entitiesError2['default']('variable: key string in not defined.');
	            }
	
	            var value = initialValue;
	            var uid = this.utils.createKeyUID(owner, key);
	            var utils = {
	                getValue: function getValue() {
	                    return value;
	                },
	                setValue: function setValue(newValue) {
	                    return value = newValue;
	                }
	            };
	
	            if (this._variables.has(uid)) {
	                return initialValue;
	            }
	
	            this._variables.set(uid, new Set());
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.variable.get, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    getValue: utils.getValue
	                }),
	                set: this.createClosure(this._watchers.variable.set, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    setValue: utils.setValue,
	                    getValue: utils.getValue
	                })
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
	
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('computed: owner object in not defined.');
	            }
	
	            if (typeof key !== 'string') {
	                throw new _entitiesError2['default']('computed: key string in not defined.');
	            }
	
	            if (typeof computedObservable !== 'function') {
	                throw new _entitiesError2['default']('computed: computedObservable function in not defined.');
	            }
	
	            var value = undefined;
	            var oldValue = undefined;
	            var _isComputing = false;
	            var dependencies = new Set();
	            var handlers = new Set();
	            var uid = this.utils.createKeyUID(owner, key);
	            var utils = {
	                getValue: function getValue() {
	                    return value;
	                },
	                setValue: function setValue(newValue) {
	                    return value = newValue;
	                },
	                setIsComputing: function setIsComputing(value) {
	                    return _isComputing = value;
	                },
	                isComputing: function isComputing() {
	                    return _isComputing;
	                }
	            };
	
	            if (this._variables.has(uid)) {
	                return computedObservable;
	            }
	
	            this._variables.set(uid, handlers);
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.computed.get, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    getValue: utils.getValue
	                }),
	                set: this.createClosure(this._watchers.computed.set, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    setValue: utils.setValue,
	                    getValue: utils.getValue,
	                    isComputing: utils.isComputing,
	                    setIsComputing: utils.setIsComputing
	                })
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
	                            oldValue = value;
	                            return computedObservable.call(owner);
	                        }).then(function (value) {
	                            owner[key] = value;
	                        })['catch'](function () {
	                            owner[key] = undefined;
	                        });
	                    });
	                }, 'will-change');
	
	                handlers.add(subscriber);
	            };
	
	            if (Symbol.iterator in Object(userDependencies)) {
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;
	
	                try {
	                    for (var _iterator2 = userDependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var userDependency = _step2.value;
	
	                        handleObservable(userDependency);
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
	            }
	
	            var calculatedValue = this.getDependencies(owner, computedObservable, handleObservable);
	            if (calculatedValue instanceof Promise) {
	                calculatedValue.then(function (result) {
	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            _isComputing = true;
	                            owner[key] = result;
	                        });
	                    });
	                });
	            } else {
	                _isComputing = true;
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
	            if (typeof object !== 'object') {
	                throw new _entitiesError2['default']('watch: object is not defined.');
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
	                } else {
	                    this.variable(object, key, value);
	                }
	            }
	
	            for (var index = 0; index < computedVariables.length; index++) {
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
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('Dispose: object is not defined.');
	            }
	
	            if (!key) {
	                var _iteratorNormalCompletion3 = true;
	                var _didIteratorError3 = false;
	                var _iteratorError3 = undefined;
	
	                try {
	                    for (var _iterator3 = Object.keys(owner)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var field = _step3.value;
	
	                        var uid = this.utils.createKeyUID(owner, field);
	                        var handlers = this._variables.get(uid);
	
	                        if (!handlers) {
	                            continue;
	                        }
	
	                        var _iteratorNormalCompletion4 = true;
	                        var _didIteratorError4 = false;
	                        var _iteratorError4 = undefined;
	
	                        try {
	                            for (var _iterator4 = handlers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                                var handler = _step4.value;
	
	                                handler.dispose();
	                                delete owner[field];
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
	
	                        this._variables['delete'](uid);
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
	            } else {
	                var uid = this.utils.createKeyUID(owner, key);
	                var handlers = this._variables.get(uid);
	
	                if (!handlers) {
	                    return;
	                }
	
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;
	
	                try {
	                    for (var _iterator5 = handlers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var handler = _step5.value;
	
	                        handler.dispose();
	                        delete owner[key];
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
	
	                this._variables['delete'](uid);
	            }
	        }
	    }]);
	
	    return Baxter;
	})();
	
	exports['default'] = new Baxter();
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @class EventService
	 */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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

	/**
	 * @name BaxterError
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BaxterError = (function (_Error) {
	    _inherits(BaxterError, _Error);
	
	    function BaxterError(message) {
	        _classCallCheck(this, BaxterError);
	
	        _get(Object.getPrototypeOf(BaxterError.prototype), 'constructor', this).call(this);
	
	        this.message = '[Baxter.js]: ' + message;
	    }
	
	    return BaxterError;
	})(Error);
	
	exports['default'] = BaxterError;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWMwODlmZTM3ZmQzNzk3Y2YyNzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7bUNDdENtQixDQUFVOzs7O0FBRTdCLEVBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBSztBQUM1QixTQUFJLGNBQWMsRUFBRTtBQUNoQix1QkFBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUM5QixNQUFNLElBQUksSUFBOEIsRUFBRTtBQUN2QyxhQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ2pELG9CQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7VUFDbEM7QUFDRCxnQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUN2QjtFQUNKLEVBQUUsUUFBUSx1QkFBVSxNQUFNLENBQUMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQ1hILENBQWtCOzs7OzBDQUNuQixDQUFrQjs7Ozs7Ozs7O0tBTXBDLE1BQU07QUFDRyxjQURULE1BQU0sR0FDTTs7OytCQURaLE1BQU07Ozs7OztBQU1KLGFBQUksR0FBRyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTVosYUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNNUIsYUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBTzVCLGFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQWlCLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNMUMsYUFBSSxDQUFDLEtBQUssR0FBRzs7Ozs7O0FBTVQsNEJBQWUsRUFBRSx5QkFBQyxNQUFNLEVBQUs7QUFDekIscUJBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDOztBQUVoQix1QkFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3JDLCtCQUFVLEVBQUUsS0FBSztBQUNqQiwwQkFBSyxFQUFFLEdBQUc7a0JBQ2IsQ0FBQyxDQUFDOztBQUVILHdCQUFPLEdBQUcsQ0FBQztjQUNkOzs7Ozs7O0FBT0QsMkJBQWMsRUFBRSx3QkFBQyxNQUFNLEVBQUs7QUFDeEIscUJBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDcEIsNEJBQU8sTUFBSyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2tCQUM3Qzs7QUFFRCx3QkFBTyxNQUFNLENBQUMsU0FBUyxDQUFDO2NBQzNCOzs7Ozs7OztBQVFELHlCQUFZLEVBQUUsc0JBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSztBQUMxQix3QkFBTyxNQUFLLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztjQUN2RDs7Ozs7Ozs7QUFRRCxxQkFBUSxFQUFFLGtCQUFDLElBQUksRUFBRSxJQUFJLEVBQUs7QUFDdEIscUJBQUksT0FBTyxDQUFDO0FBQ1osd0JBQU8sWUFBTTtBQUNULHlCQUFJLEtBQUssR0FBRyxTQUFSLEtBQUssR0FBUztBQUNkLDZCQUFJLEVBQUUsQ0FBQztBQUNQLGdDQUFPLEdBQUcsSUFBSSxDQUFDO3NCQUNsQixDQUFDO0FBQ0YsaUNBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0Qiw0QkFBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7a0JBQ3JDLENBQUM7Y0FDTDtVQUNKLENBQUM7O0FBRUYsYUFBSSxDQUFDLFNBQVMsR0FBRztBQUNiLHFCQUFRLEVBQUU7QUFDTixvQkFBRyxFQUFFLGFBQUMsTUFBTSxFQUFLO0FBQ2IseUJBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFOUIsMkJBQUssU0FBUyxDQUFDLEtBQUssRUFDaEI7QUFDSSw0QkFBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLO0FBQ2pCLDhCQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7QUFDbkIsNEJBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztBQUNmLDhCQUFLLEVBQUUsS0FBSztzQkFDZixDQUNKLENBQUM7QUFDRiw0QkFBTyxLQUFLLENBQUM7a0JBQ2hCO0FBQ0Qsb0JBQUcsRUFBRSxhQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUs7QUFDdkIseUJBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFakMseUJBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUN2QixnQ0FBTyxLQUFLLENBQUM7c0JBQ2hCOztBQUVELDJCQUFLLFNBQVMsQ0FBQyxhQUFhLEVBQUU7QUFDMUIsNEJBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztBQUNmLDhCQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7QUFDbkIsNEJBQUcsRUFBRSxNQUFNLENBQUMsR0FBRztzQkFDbEIsQ0FBQyxDQUFDOztBQUVILDJCQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQiwyQkFBSyxTQUFTLENBQUMsUUFBUSxFQUNuQjtBQUNJLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO0FBQ25CLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLFFBQVE7QUFDZixpQ0FBUSxFQUFFLFFBQVE7c0JBQ3JCLENBQ0osQ0FBQztrQkFDTDtjQUNKO0FBQ0QscUJBQVEsRUFBRTtBQUNOLG9CQUFHLEVBQUUsYUFBQyxNQUFNLEVBQUs7QUFDYix5QkFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUU5QiwyQkFBSyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ2xCLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO0FBQ25CLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLEtBQUs7c0JBQ2YsQ0FBQyxDQUFDOztBQUVILDRCQUFPLEtBQUssQ0FBQztrQkFDaEI7QUFDRCxvQkFBRyxFQUFFLGFBQUMsTUFBTSxFQUFFLGNBQWMsRUFBSztBQUM3Qix5QkFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVqQyx5QkFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN2QiwrQkFBTSwrQkFBZ0Isa0NBQWtDLENBQUMsQ0FBQztzQkFDN0Q7O0FBRUQseUJBQUksY0FBYyxLQUFLLFFBQVEsRUFBRTtBQUM3QixnQ0FBTyxLQUFLLENBQUM7c0JBQ2hCOztBQUVELDJCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLDJCQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUdoQywyQkFBSyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3JCLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO0FBQ25CLDRCQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7QUFDZiw4QkFBSyxFQUFFLGNBQWM7QUFDckIsaUNBQVEsRUFBRSxRQUFRO3NCQUNyQixDQUFDLENBQUM7a0JBQ047Y0FDSjtVQUNKLENBQUM7O0FBRUYsYUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7b0JBQU0sTUFBSyxTQUFTLENBQUMsaUJBQWlCLENBQUM7VUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdkc7Ozs7Ozs7OztrQkEzS0MsTUFBTTs7Z0JBbUxLLHVCQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDeEIsb0JBQU8sVUFBQyxJQUFJLEVBQUs7QUFDYix3QkFBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2NBQzdCO1VBQ0o7Ozs7Ozs7Ozs7Z0JBUWEsd0JBQUMsU0FBUyxFQUFFLFVBQVUsRUFBZ0I7OztpQkFBZCxJQUFJLHlEQUFHLEtBQUs7O0FBQzlDLGlCQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtBQUMvQix1QkFBTSwrQkFBZ0IsMkNBQTJDLENBQUMsQ0FBQztjQUN0RTs7QUFFRCxpQkFBSSxPQUFPLFVBQVUsS0FBSyxVQUFVLEVBQUU7QUFDbEMsdUJBQU0sK0JBQWdCLHFEQUFxRCxDQUFDLENBQUM7Y0FDaEY7O0FBRUQsaUJBQUksSUFBSSxFQUFFO0FBQ04scUJBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztjQUNoRCxNQUFNO0FBQ0gscUJBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFM0Msd0JBQU87QUFDSCw0QkFBTyxFQUFFO2dDQUFNLE9BQUssV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO3NCQUFBO2tCQUM3RDtjQUNKO1VBQ0o7Ozs7Ozs7OztnQkFPUSxtQkFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFO0FBQ3ZCLGlCQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtBQUMvQix1QkFBTSwrQkFBZ0Isc0NBQXNDLENBQUMsQ0FBQztjQUNqRTs7QUFFRCxpQkFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1VBQzFDOzs7Ozs7Ozs7Ozs7O2dCQVdRLG1CQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFzQztpQkFBcEMsU0FBUyx5REFBRyxRQUFRO2lCQUFFLElBQUkseURBQUcsS0FBSzs7QUFDaEUsaUJBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDL0IsdUJBQU0sK0JBQWdCLCtFQUErRSxDQUFDLENBQUM7Y0FDMUc7QUFDRCxpQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLGlCQUFJLGVBQWUsR0FBRyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRCxpQkFBSSxhQUFhLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUM7QUFDM0UsaUJBQUksWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLE1BQU0sRUFBSztBQUMzQixxQkFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUNwQiwrQkFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2tCQUM3QztjQUNKLENBQUM7O0FBRUYsaUJBQUksQ0FBQyxhQUFhLEVBQUU7QUFDaEIsdUJBQU0sK0JBQWdCLHVCQUF1QixHQUFHLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO2NBQzFGOztBQUVELG9CQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztVQUNqRTs7Ozs7Ozs7O2dCQU9NLGlCQUFDLFlBQVksRUFBRTtBQUNsQixpQkFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLEVBQUU7QUFDcEMsdUJBQU0sK0JBQWdCLHlDQUF5QyxDQUFDLENBQUM7Y0FDcEU7O0FBRUQsaUJBQUksTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFFdkIsc0NBQXVCLFlBQVksOEhBQUU7eUJBQTVCLFVBQVU7O0FBQ2YsMkJBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztrQkFDL0M7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxvQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBQzlCOzs7Ozs7Ozs7OztnQkFTYyx5QkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUN6QyxpQkFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNwQyx1QkFBTSwrQkFBZ0Isc0VBQXNFLENBQUMsQ0FBQztjQUNqRzs7QUFFRCxpQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDcEQsaUJBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdDLHFCQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRW5CLG9CQUFPLGVBQWUsQ0FBQztVQUMxQjs7Ozs7Ozs7OztnQkFRUyxvQkFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTs7O0FBQzdCLGlCQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRTlDLGlCQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtBQUMxQixvQkFBRyxFQUFFLEdBQUc7QUFDUixzQkFBSyxFQUFFLEtBQUs7QUFDWixvQkFBRyxFQUFFLEdBQUc7Y0FDWCxDQUFDLENBQUM7O0FBRUgsaUJBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM5Qyx3QkFBSyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsWUFBTTtBQUN6Qyw0QkFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7a0JBQ3ZCLEVBQUUsSUFBSSxDQUFDLENBQUM7Y0FDWixDQUFDLENBQ0csSUFBSSxDQUFDLFlBQU07QUFDUix3QkFBSyxVQUFVLFVBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixxQkFBSSxDQUFDLE9BQUssVUFBVSxDQUFDLElBQUksRUFBRTtBQUN2Qiw0QkFBSyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztrQkFDckM7Y0FDSixDQUFDLENBQUMsQ0FBQztVQUNYOzs7Ozs7Ozs7OztnQkFTTyxrQkFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRTtBQUMvQixpQkFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDM0IsdUJBQU0sK0JBQWdCLHdDQUF3QyxDQUFDLENBQUM7Y0FDbkU7QUFDRCxpQkFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7QUFDekIsdUJBQU0sK0JBQWdCLHNDQUFzQyxDQUFDLENBQUM7Y0FDakU7O0FBRUQsaUJBQUksS0FBSyxHQUFHLFlBQVksQ0FBQztBQUN6QixpQkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLGlCQUFJLEtBQUssR0FBRztBQUNSLHlCQUFRLEVBQUU7NEJBQU0sS0FBSztrQkFBQTtBQUNyQix5QkFBUSxFQUFFLGtCQUFDLFFBQVE7NEJBQUssS0FBSyxHQUFHLFFBQVE7a0JBQUE7Y0FDM0MsQ0FBQzs7QUFFRixpQkFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMxQix3QkFBTyxZQUFZLENBQUM7Y0FDdkI7O0FBRUQsaUJBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7O0FBRXBDLG1CQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQzVCO0FBQ0ksNkJBQVksRUFBRSxJQUFJO0FBQ2xCLG9CQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDakQsd0JBQUcsRUFBRSxHQUFHO0FBQ1IsMEJBQUssRUFBRSxLQUFLO0FBQ1osd0JBQUcsRUFBRSxHQUFHO0FBQ1IsNkJBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtrQkFDM0IsQ0FBQztBQUNGLG9CQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDakQsd0JBQUcsRUFBRSxHQUFHO0FBQ1IsMEJBQUssRUFBRSxLQUFLO0FBQ1osd0JBQUcsRUFBRSxHQUFHO0FBQ1IsNkJBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN4Qiw2QkFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2tCQUMzQixDQUFDO2NBQ0wsQ0FDSixDQUFDOztBQUVGLG9CQUFPLEtBQUssQ0FBQztVQUNoQjs7Ozs7Ozs7Ozs7O2dCQVVPLGtCQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUU7OztBQUN2RCxpQkFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDM0IsdUJBQU0sK0JBQWdCLHdDQUF3QyxDQUFDLENBQUM7Y0FDbkU7O0FBRUQsaUJBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO0FBQ3pCLHVCQUFNLCtCQUFnQixzQ0FBc0MsQ0FBQyxDQUFDO2NBQ2pFOztBQUVELGlCQUFJLE9BQU8sa0JBQWtCLEtBQUssVUFBVSxFQUFFO0FBQzFDLHVCQUFNLCtCQUFnQix1REFBdUQsQ0FBQyxDQUFDO2NBQ2xGOztBQUVELGlCQUFJLEtBQUssYUFBQztBQUNWLGlCQUFJLFFBQVEsYUFBQztBQUNiLGlCQUFJLFlBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsaUJBQUksWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsaUJBQUksUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekIsaUJBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5QyxpQkFBSSxLQUFLLEdBQUc7QUFDUix5QkFBUSxFQUFFOzRCQUFNLEtBQUs7a0JBQUE7QUFDckIseUJBQVEsRUFBRSxrQkFBQyxRQUFROzRCQUFLLEtBQUssR0FBRyxRQUFRO2tCQUFBO0FBQ3hDLCtCQUFjLEVBQUUsd0JBQUMsS0FBSzs0QkFBSyxZQUFXLEdBQUcsS0FBSztrQkFBQTtBQUM5Qyw0QkFBVyxFQUFFOzRCQUFNLFlBQVc7a0JBQUE7Y0FDakMsQ0FBQzs7QUFFRixpQkFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMxQix3QkFBTyxrQkFBa0IsQ0FBQztjQUM3Qjs7QUFFRCxpQkFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVuQyxtQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQzlCLDZCQUFZLEVBQUUsSUFBSTtBQUNsQixvQkFBRyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ2pELHdCQUFHLEVBQUUsR0FBRztBQUNSLDBCQUFLLEVBQUUsS0FBSztBQUNaLHdCQUFHLEVBQUUsR0FBRztBQUNSLDZCQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7a0JBQzNCLENBQUM7QUFDRixvQkFBRyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQ2pELHdCQUFHLEVBQUUsR0FBRztBQUNSLDBCQUFLLEVBQUUsS0FBSztBQUNaLHdCQUFHLEVBQUUsR0FBRztBQUNSLDZCQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7QUFDeEIsNkJBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtBQUN4QixnQ0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO0FBQzlCLG1DQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7a0JBQ3ZDLENBQUM7Y0FDTCxDQUFDLENBQUM7O0FBRUgsaUJBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksWUFBWSxFQUFLO0FBQ3JDLDZCQUFZLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbkMscUJBQUksVUFBVSxHQUFHLE9BQUssU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEdBQUcsRUFBRSxZQUFNO0FBQ3hFLHlCQUFJLFlBQVcsRUFBRTtBQUNiLGdDQUFPLEtBQUssQ0FBQztzQkFDaEI7O0FBRUQsaUNBQVcsR0FBRyxJQUFJLENBQUM7O0FBRW5CLDRCQUFLLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQU07QUFDOUIsZ0NBQU8sT0FBSyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQzVCLElBQUksQ0FBQyxZQUFNO0FBQ1IscUNBQVEsR0FBRyxLQUFLLENBQUM7QUFDakIsb0NBQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzBCQUN6QyxDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ2Isa0NBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7MEJBQ3RCLENBQUMsU0FDSSxDQUFDLFlBQU07QUFDVCxrQ0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQzswQkFDMUIsQ0FBQyxDQUFDO3NCQUNWLENBQUMsQ0FBQztrQkFDTixFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUVsQix5QkFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztjQUM1QixDQUFDOztBQUVGLGlCQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7Ozs7OztBQUM3QywyQ0FBMkIsZ0JBQWdCLG1JQUFFOzZCQUFwQyxjQUFjOztBQUNuQix5Q0FBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztzQkFDcEM7Ozs7Ozs7Ozs7Ozs7OztjQUNKOztBQUVELGlCQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hGLGlCQUFJLGVBQWUsWUFBWSxPQUFPLEVBQUU7QUFDcEMsZ0NBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDN0IsNEJBQUssVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsWUFBTTtBQUM5QixnQ0FBTyxPQUFLLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FDNUIsSUFBSSxDQUFDLFlBQU07QUFDUix5Q0FBVyxHQUFHLElBQUksQ0FBQztBQUNuQixrQ0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQzswQkFDdkIsQ0FBQyxDQUFDO3NCQUNWLENBQUMsQ0FBQztrQkFDTixDQUFDLENBQUM7Y0FDTixNQUFNO0FBQ0gsNkJBQVcsR0FBRyxJQUFJLENBQUM7QUFDbkIsc0JBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUM7Y0FDaEM7O0FBRUQsb0JBQU8sS0FBSyxDQUFDO1VBQ2hCOzs7Ozs7OztnQkFNSSxlQUFDLE1BQU0sRUFBRTtBQUNWLGlCQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtBQUM1Qix1QkFBTSwrQkFBZ0IsK0JBQStCLENBQUMsQ0FBQztjQUMxRDs7QUFFRCxpQkFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7O0FBRTNCLGtCQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUNwQixxQkFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDN0IsOEJBQVM7a0JBQ1o7O0FBRUQscUJBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixxQkFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7QUFDN0Isc0NBQWlCLENBQUMsSUFBSSxDQUFDO0FBQ25CLDhCQUFLLEVBQUUsTUFBTTtBQUNiLDRCQUFHLEVBQUUsR0FBRztBQUNSLDhCQUFLLEVBQUUsS0FBSztzQkFDZixDQUFDLENBQUM7a0JBQ04sTUFBTTtBQUNILHlCQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7a0JBQ3JDO2NBQ0o7O0FBRUQsa0JBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDM0QscUJBQUksUUFBUSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLHFCQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Y0FDL0Q7O0FBRUQsb0JBQU8sTUFBTSxDQUFDO1VBQ2pCOzs7Ozs7Ozs7Z0JBT00saUJBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtBQUNoQixpQkFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDM0IsdUJBQU0sK0JBQWdCLGlDQUFpQyxDQUFDLENBQUM7Y0FDNUQ7O0FBRUQsaUJBQUksQ0FBQyxHQUFHLEVBQUU7Ozs7OztBQUNOLDJDQUFtQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxtSUFBRzs2QkFBL0IsS0FBSzs7QUFDViw2QkFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELDZCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFeEMsNkJBQUksQ0FBQyxRQUFRLEVBQUU7QUFDWCxzQ0FBUzswQkFDWjs7Ozs7OztBQUVELG1EQUFvQixRQUFRLG1JQUFFO3FDQUFyQixPQUFPOztBQUNaLHdDQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEIsd0NBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOzhCQUN2Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELDZCQUFJLENBQUMsVUFBVSxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7c0JBQy9COzs7Ozs7Ozs7Ozs7Ozs7Y0FDSixNQUFNO0FBQ0gscUJBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5QyxxQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXhDLHFCQUFJLENBQUMsUUFBUSxFQUFFO0FBQ1gsNEJBQU87a0JBQ1Y7Ozs7Ozs7QUFFRCwyQ0FBb0IsUUFBUSxtSUFBRTs2QkFBckIsT0FBTzs7QUFDWixnQ0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLGdDQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztzQkFDckI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxxQkFBSSxDQUFDLFVBQVUsVUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2NBQy9CO1VBQ0o7OztZQS9pQkMsTUFBTTs7O3NCQWtqQkcsSUFBSSxNQUFNLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tDdGpCckIsWUFBWTtBQUNILGNBRFQsWUFBWSxDQUNGLGNBQWMsRUFBRTsrQkFEMUIsWUFBWTs7Ozs7O0FBTVYsYUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1uQixhQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsSUFBSSxJQUFJLENBQUM7TUFDekM7Ozs7Ozs7O2tCQWJDLFlBQVk7O2dCQW9CTixrQkFBQyxLQUFLLEVBQUU7QUFDWixpQkFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0Isd0JBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO2NBQzNDOztBQUVELG9CQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7VUFDL0I7Ozs7Ozs7OztnQkFPQyxZQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDZixpQkFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNwQix1QkFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2NBQ3JFOztBQUVELGlCQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztVQUNyQzs7Ozs7Ozs7O2dCQU9HLGNBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNqQixpQkFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNwQix1QkFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2NBQ3JFOztBQUVELGlCQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLGlCQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFekMsc0JBQVMsY0FBYyxDQUFDLElBQUksRUFBRTtBQUMxQixxQkFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDaEMsd0JBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2NBQ3hCO1VBR0o7Ozs7Ozs7Ozs7Z0JBUUUsYUFBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO0FBQ3hCLGlCQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1IsdUJBQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztjQUM1RDs7QUFFRCxpQkFBSSxDQUFDLGVBQWUsRUFBRTtBQUNsQix3QkFBTyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Y0FDdEM7O0FBRUQsaUJBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXpDLDBCQUFhLFVBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFdEMsaUJBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHdCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Y0FDL0I7VUFDSjs7Ozs7Ozs7O2dCQU9HLGNBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNkLGlCQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1IsdUJBQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztjQUNqRDs7QUFFRCxpQkFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0Isd0JBQU8sS0FBSyxDQUFDO2NBQ2hCOzs7Ozs7O0FBRUQsc0NBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLDhIQUFFO3lCQUFqQyxPQUFPOztBQUNaLDRCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7a0JBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7VUFDSjs7O1lBeEdDLFlBQVk7OztzQkEyR0gsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQzNHckIsV0FBVztlQUFYLFdBQVc7O0FBQ0YsY0FEVCxXQUFXLENBQ0QsT0FBTyxFQUFFOytCQURuQixXQUFXOztBQUVULG9DQUZGLFdBQVcsNkNBRUQ7O0FBRVIsYUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFlLEdBQUcsT0FBTyxDQUFDO01BQzVDOztZQUxDLFdBQVc7SUFBUyxLQUFLOztzQkFRaEIsV0FBVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYWMwODlmZTM3ZmQzNzk3Y2YyNzdcbiAqKi8iLCJpbXBvcnQgYmF4dGVyIGZyb20gJy4vYmF4dGVyJztcblxuKChuYW1lLCBsaWIsIGJyb3dzZXJDb250ZXh0KSA9PiB7XG4gICAgaWYgKGJyb3dzZXJDb250ZXh0KSB7XG4gICAgICAgIGJyb3dzZXJDb250ZXh0W25hbWVdID0gbGliO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbGliO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHNbbmFtZV0gPSBsaWI7XG4gICAgfVxufSkoJ2JheHRlcicsIGJheHRlciwgd2luZG93KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IEV2ZW50U2VydmljZSBmcm9tICcuL3NlcnZpY2VzL2V2ZW50JztcbmltcG9ydCBCYXh0ZXJFcnJvciBmcm9tICcuL2VudGl0aWVzL2Vycm9yJztcblxuLyoqXG4gKiBAY2xhc3MgQmF4dGVyXG4gKiBAZGVzY3JpcHRpb24gTWFpbiBjbGFzcywgcHJvdmlkZXMgbGlicmFyeSBhcyBpdCBzZWxmLlxuICovXG5jbGFzcyBCYXh0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIEJhc2ljIHVuaXF1ZSBpZCwgb3RoZXIgdWlkcyBhcmUgaW5jcmVtZW50ZWQgZnJvbSB0aGlzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgVUlEID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLl9jYWxsc3RhY2tcbiAgICAgICAgICogQHR5cGUge01hcH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxzdGFjayA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLl92YXJpYWJsZXNcbiAgICAgICAgICogQHR5cGUge01hcH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3ZhcmlhYmxlcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLmV2ZW50U3RyZWFtXG4gICAgICAgICAqIEB0eXBlIHtFdmVudFNlcnZpY2V9XG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBQcm92aWRlcyBldmVudHMgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbSA9IG5ldyBFdmVudFNlcnZpY2UodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlci51dGlsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51dGlscyA9IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmNyZWF0ZU9iamVjdFVJRFxuICAgICAgICAgICAgICogQHBhcmFtIG9iamVjdFxuICAgICAgICAgICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlT2JqZWN0VUlEOiAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVpZCA9IFVJRCsrO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fdWlkX18nLCB7XG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdWlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdWlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmFtZSBCYXh0ZXIudXRpbHMuZ2V0VUlEQnlPYmplY3RcbiAgICAgICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRVSURCeU9iamVjdDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghb2JqZWN0WydfX3VpZF9fJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY3JlYXRlT2JqZWN0VUlEKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFsnX191aWRfXyddXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlci51dGlscy5jcmVhdGVLZXlVSURcbiAgICAgICAgICAgICAqIEBwYXJhbSBvd25lclxuICAgICAgICAgICAgICogQHBhcmFtIGtleVxuICAgICAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlS2V5VUlEOiAob3duZXIsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmdldFVJREJ5T2JqZWN0KG93bmVyKSArICc6JyArIGtleTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmRlYm91bmNlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICAgICAgICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVib3VuY2U6IChmdW5jLCB3YWl0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSB7XG4gICAgICAgICAgICB2YXJpYWJsZToge1xuICAgICAgICAgICAgICAgIGdldDogKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBjb25maWcuZ2V0VmFsdWUoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogY29uZmlnLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiAoY29uZmlnLCBuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBjb25maWcuZ2V0VmFsdWUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnd2lsbC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5zZXRWYWx1ZShuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3VwZGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiBjb25maWcudWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBjb25maWcub3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBuZXdWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgICAgICBnZXQ6IChjb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gY29uZmlnLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2dldCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogY29uZmlnLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBjb25maWcub3duZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0OiAoY29uZmlnLCBjb21wdXRlZFJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBjb25maWcuZ2V0VmFsdWUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZy5pc0NvbXB1dGluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3lvdSBjYW5cXCd0IHNldCB2YWx1ZSB0byBjb21wdXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkUmVzdWx0ID09PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnNldElzQ29tcHV0aW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnNldFZhbHVlKGNvbXB1dGVkUmVzdWx0KTtcblxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbXB1dGVkUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnN1YnNjcmliZUV2ZW50KCd3aWxsLWNoYW5nZScsIHRoaXMudXRpbHMuZGVib3VuY2UoKCkgPT4gdGhpcy5wb3N0RXZlbnQoJ3dpbGwtY2hhbmdlLWFsbCcpLCAwKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLmNyZWF0ZUNsb3N1cmVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAgICogQHBhcmFtIHsqfSBjb25maWdcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgY3JlYXRlQ2xvc3VyZShmdW5jLCBjb25maWcpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZnVuYyhjb25maWcsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLnN1YnNjcmliZUV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZXJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlXVxuICAgICAqL1xuICAgIHN1YnNjcmliZUV2ZW50KGV2ZW50VHlwZSwgc3Vic2NyaWJlciwgb25jZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnRUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdzdWJzY3JpYmVFdmVudDogZXZlbnRUeXBlIGlzIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3N1YnNjcmliZUV2ZW50OiBzdWJzY3JpYmVyIGZ1bmN0aW9uIGlzIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub25jZShldmVudFR5cGUsIHN1YnNjcmliZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5vbihldmVudFR5cGUsIHN1YnNjcmliZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRpc3Bvc2U6ICgpID0+IHRoaXMuZXZlbnRTdHJlYW0ub2ZmKGV2ZW50VHlwZSwgc3Vic2NyaWJlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5wb3N0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gICAgICogQHBhcmFtIHsqfSBbZGF0YV1cbiAgICAgKi9cbiAgICBwb3N0RXZlbnQoZXZlbnRUeXBlLCBkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnRUeXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdwb3N0RXZlbnQ6IGV2ZW50VHlwZSBpcyBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdChldmVudFR5cGUsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5zdWJzY3JpYmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRUeXBlXVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2VdXG4gICAgICogQHRocm93cyB7QmF4dGVyRXJyb3J9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKG93bmVyLCBrZXksIHN1YnNjcmliZXIsIGV2ZW50VHlwZSA9ICd1cGRhdGUnLCBvbmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFvd25lciB8fCAha2V5IHx8ICFzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3N1YnNjcmliZTogY2FuXFwndCBzdWJzY3JpYmUgdmFyaWFibGUgd2l0aG91dCBvd25lciwga2V5IG9yIGNhbGxiYWNrIGZ1bmN0aW9uLicpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcbiAgICAgICAgbGV0IGF2YWlsYWJsZUV2ZW50cyA9IFsnd2lsbC1jaGFuZ2UnLCAndXBkYXRlJ107XG4gICAgICAgIGxldCBldmVudFRvTGlzdGVuID0gYXZhaWxhYmxlRXZlbnRzLmluZGV4T2YoZXZlbnRUeXBlKSAhPT0gLTEgJiYgZXZlbnRUeXBlO1xuICAgICAgICBsZXQgZXZlbnRIYW5kbGVyID0gKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy51aWQgPT09IHVpZCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIoY29uZmlnLnZhbHVlLCBjb25maWcub2xkVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghZXZlbnRUb0xpc3Rlbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdzdWJzY3JpYmU6IGxpc3RlbmluZyAnICsgZXZlbnRUeXBlICsgJyBldmVudCBpcyBub3QgYWNjZXB0ZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpYmVFdmVudChldmVudFRvTGlzdGVuLCBldmVudEhhbmRsZXIsIG9uY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5yZXNvbHZlXG4gICAgICogQHBhcmFtIHtTZXR8QXJyYXl9IGRlcGVuZGVuY2llc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHJlc29sdmUoZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGlmICghKFN5bWJvbC5pdGVyYXRvciBpbiBkZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3Jlc29sdmU6IGRlcGVuZGVuY2llcyBhcmUgbm90IGl0ZXJhYmxlLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcblxuICAgICAgICBmb3IgKGxldCBkZXBlbmRlbmN5IG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgcmVzdWx0LmFkZCh0aGlzLl9jYWxsc3RhY2suZ2V0KGRlcGVuZGVuY3kpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5nZXREZXBlbmRlbmNpZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7Kn0gUmVzdWx0IG9mIGNvbXB1dGluZ1xuICAgICAqL1xuICAgIGdldERlcGVuZGVuY2llcyhjb250ZXh0LCBjb21wdXRlZCwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFjb250ZXh0IHx8ICFjb21wdXRlZCB8fCAhY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcignZ2V0RGVwZW5kZW5jaWVzOiB0aGVyZSBpcyBubyBjb250ZXh0LCBjb21wdXRlZCBmdW5jdGlvbiBvciBjYWxsYmFjay4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsaXN0ZW5lciA9IHRoaXMuc3Vic2NyaWJlRXZlbnQoJ2dldCcsIGNhbGxiYWNrKTtcbiAgICAgICAgbGV0IGNvbXB1dGluZ1Jlc3VsdCA9IGNvbXB1dGVkLmNhbGwoY29udGV4dCk7XG5cbiAgICAgICAgbGlzdGVuZXIuZGlzcG9zZSgpO1xuXG4gICAgICAgIHJldHVybiBjb21wdXRpbmdSZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLmFkZFRvU3RhY2tcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBhZGRUb1N0YWNrKG93bmVyLCBrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcblxuICAgICAgICB0aGlzLnBvc3RFdmVudCgnd2lsbC1jaGFuZ2UnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2NhbGxzdGFjay5zZXQodWlkLCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVFdmVudCgnd2lsbC1jaGFuZ2UtYWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2FsbGJhY2soKSk7XG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsc3RhY2suZGVsZXRlKHVpZCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9jYWxsc3RhY2suc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnY2hhbmdlLWNvbXBsZXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci52YXJpYWJsZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0geyp9IFtpbml0aWFsVmFsdWVdXG4gICAgICogQHJldHVybnMgeyp9IHZhbHVlXG4gICAgICovXG4gICAgdmFyaWFibGUob3duZXIsIGtleSwgaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3duZXIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3ZhcmlhYmxlOiBvd25lciBvYmplY3QgaW4gbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3ZhcmlhYmxlOiBrZXkgc3RyaW5nIGluIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgIGxldCB1dGlscyA9IHtcbiAgICAgICAgICAgIGdldFZhbHVlOiAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICAgIHNldFZhbHVlOiAobmV3VmFsdWUpID0+IHZhbHVlID0gbmV3VmFsdWVcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5fdmFyaWFibGVzLmhhcyh1aWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5pdGlhbFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmFyaWFibGVzLnNldCh1aWQsIG5ldyBTZXQoKSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG93bmVyLCBrZXksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldDogdGhpcy5jcmVhdGVDbG9zdXJlKHRoaXMuX3dhdGNoZXJzLnZhcmlhYmxlLmdldCwge1xuICAgICAgICAgICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWU6IHV0aWxzLmdldFZhbHVlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgc2V0OiB0aGlzLmNyZWF0ZUNsb3N1cmUodGhpcy5fd2F0Y2hlcnMudmFyaWFibGUuc2V0LCB7XG4gICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBzZXRWYWx1ZTogdXRpbHMuc2V0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGdldFZhbHVlOiB1dGlscy5nZXRWYWx1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5jb21wdXRlZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wdXRlZE9ic2VydmFibGVcbiAgICAgKiBAcGFyYW0ge1NldHxNYXB8QXJyYXl9IFt1c2VyRGVwZW5kZW5jaWVzXVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGNvbXB1dGVkKG93bmVyLCBrZXksIGNvbXB1dGVkT2JzZXJ2YWJsZSwgdXNlckRlcGVuZGVuY2llcykge1xuICAgICAgICBpZiAodHlwZW9mIG93bmVyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdjb21wdXRlZDogb3duZXIgb2JqZWN0IGluIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ2NvbXB1dGVkOiBrZXkgc3RyaW5nIGluIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb21wdXRlZE9ic2VydmFibGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcignY29tcHV0ZWQ6IGNvbXB1dGVkT2JzZXJ2YWJsZSBmdW5jdGlvbiBpbiBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgbGV0IG9sZFZhbHVlO1xuICAgICAgICBsZXQgaXNDb21wdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgbGV0IGRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IGhhbmRsZXJzID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgIGxldCB1dGlscyA9IHtcbiAgICAgICAgICAgIGdldFZhbHVlOiAoKSA9PiB2YWx1ZSxcbiAgICAgICAgICAgIHNldFZhbHVlOiAobmV3VmFsdWUpID0+IHZhbHVlID0gbmV3VmFsdWUsXG4gICAgICAgICAgICBzZXRJc0NvbXB1dGluZzogKHZhbHVlKSA9PiBpc0NvbXB1dGluZyA9IHZhbHVlLFxuICAgICAgICAgICAgaXNDb21wdXRpbmc6ICgpID0+IGlzQ29tcHV0aW5nXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX3ZhcmlhYmxlcy5oYXModWlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkT2JzZXJ2YWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ZhcmlhYmxlcy5zZXQodWlkLCBoYW5kbGVycyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG93bmVyLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogdGhpcy5jcmVhdGVDbG9zdXJlKHRoaXMuX3dhdGNoZXJzLmNvbXB1dGVkLmdldCwge1xuICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZTogdXRpbHMuZ2V0VmFsdWVcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc2V0OiB0aGlzLmNyZWF0ZUNsb3N1cmUodGhpcy5fd2F0Y2hlcnMuY29tcHV0ZWQuc2V0LCB7XG4gICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIHNldFZhbHVlOiB1dGlscy5zZXRWYWx1ZSxcbiAgICAgICAgICAgICAgICBnZXRWYWx1ZTogdXRpbHMuZ2V0VmFsdWUsXG4gICAgICAgICAgICAgICAgaXNDb21wdXRpbmc6IHV0aWxzLmlzQ29tcHV0aW5nLFxuICAgICAgICAgICAgICAgIHNldElzQ29tcHV0aW5nOiB1dGlscy5zZXRJc0NvbXB1dGluZ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGhhbmRsZU9ic2VydmFibGUgPSAoaGFuZGxlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBkZXBlbmRlbmNpZXMuYWRkKGhhbmRsZWRWYWx1ZS51aWQpO1xuXG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlciA9IHRoaXMuc3Vic2NyaWJlKGhhbmRsZWRWYWx1ZS5vd25lciwgaGFuZGxlZFZhbHVlLmtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbXB1dGluZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXNDb21wdXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKG93bmVyLCBrZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZShkZXBlbmRlbmNpZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRPYnNlcnZhYmxlLmNhbGwob3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sICd3aWxsLWNoYW5nZScpO1xuXG4gICAgICAgICAgICBoYW5kbGVycy5hZGQoc3Vic2NyaWJlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodXNlckRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHVzZXJEZXBlbmRlbmN5IG9mIHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVPYnNlcnZhYmxlKHVzZXJEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYWxjdWxhdGVkVmFsdWUgPSB0aGlzLmdldERlcGVuZGVuY2llcyhvd25lciwgY29tcHV0ZWRPYnNlcnZhYmxlLCBoYW5kbGVPYnNlcnZhYmxlKTtcbiAgICAgICAgaWYgKGNhbGN1bGF0ZWRWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRWYWx1ZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU3RhY2sob3duZXIsIGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG4gICAgICAgICAgICBvd25lcltrZXldID0gY2FsY3VsYXRlZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci53YXRjaFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICAgKi9cbiAgICB3YXRjaChvYmplY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3dhdGNoOiBvYmplY3QgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29tcHV0ZWRWYXJpYWJsZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFyaWFibGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb21wdXRlZFZhcmlhYmxlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBjb21wdXRlZCA9IGNvbXB1dGVkVmFyaWFibGVzW2luZGV4XTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWQoY29tcHV0ZWQub3duZXIsIGNvbXB1dGVkLmtleSwgY29tcHV0ZWQudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuZGlzcG9zZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgICAqL1xuICAgIGRpc3Bvc2Uob3duZXIsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIG93bmVyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdEaXNwb3NlOiBvYmplY3QgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgKE9iamVjdC5rZXlzKG93bmVyKSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLl92YXJpYWJsZXMuZ2V0KHVpZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvd25lcltmaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFyaWFibGVzLmRlbGV0ZSh1aWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJzID0gdGhpcy5fdmFyaWFibGVzLmdldCh1aWQpO1xuXG4gICAgICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG93bmVyW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhcmlhYmxlcy5kZWxldGUodWlkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJheHRlcigpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYmF4dGVyLmpzXG4gKiovIiwiLyoqXG4gKiBAY2xhc3MgRXZlbnRTZXJ2aWNlXG4gKi9cbmNsYXNzIEV2ZW50U2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoZGVmYXVsdENvbnRleHQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5jaGFubmVsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jaGFubmVscyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuY29udGV4dFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gZGVmYXVsdENvbnRleHQgfHwgdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuZ2V0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7U2V0fVxuICAgICAqL1xuICAgIGdldEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gRXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGRhdGEgYXMgYXJndW1lbnRcbiAgICAgKi9cbiAgICBvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgICBpZiAoIWV2ZW50IHx8ICFoYW5kbGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0IGV2ZW50IGxpc3RlbmVyOiBubyBwYXJhbWV0ZXJzIGdpdmVuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRFdmVudChldmVudCkuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5vbmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuICAgICAqL1xuICAgIG9uY2UoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgaW5pdCBldmVudCBsaXN0ZW5lcjogbm8gcGFyYW1ldGVycyBnaXZlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLmdldEV2ZW50KGV2ZW50KS5hZGQoaGFuZGxlcldyYXBwZXIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZXJXcmFwcGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHRoYXQub2ZmKGV2ZW50LCBoYW5kbGVyV3JhcHBlcik7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihkYXRhKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub2ZmXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2hhbmRsZXJUb0RlbGV0ZV1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBvZmYoZXZlbnQsIGhhbmRsZXJUb0RlbGV0ZSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgZXZlbnQgbGlzdGVuZXI6IG5vIGV2ZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZXZlbnRIYW5kbGVycyA9IHRoaXMuY2hhbm5lbHNbZXZlbnRdO1xuXG4gICAgICAgIGV2ZW50SGFuZGxlcnMuZGVsZXRlKGhhbmRsZXJUb0RlbGV0ZSk7XG5cbiAgICAgICAgaWYgKCFldmVudEhhbmRsZXJzLnNpemUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2V2ZW50XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5wb3N0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICovXG4gICAgcG9zdChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBwb3N0IHVuZGVmaW5lZCBldmVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuY2hhbm5lbHNbZXZlbnRdKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcy5jb250ZXh0LCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2VydmljZXMvZXZlbnQuanNcbiAqKi8iLCIvKipcbiAqIEBuYW1lIEJheHRlckVycm9yXG4gKi9cbmNsYXNzIEJheHRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnW0JheHRlci5qc106ICcgKyBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmF4dGVyRXJyb3I7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRpdGllcy9lcnJvci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=