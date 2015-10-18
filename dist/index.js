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

	        this.objectUID = new Map();

	        /**
	         * @name Baxter.callstack
	         * @type {Map}
	         */
	        this.callstack = new Map();

	        /**
	         * @name Baxter.eventStream
	         * @type {EventService}
	         * @description Provides events inside library
	         */
	        this.eventStream = new _servicesEvent2['default'](this);

	        /**
	         * @name Baxter.utils
	         * @type {Object}
	         */
	        this.utils = {
	            createObjectUID: function createObjectUID(object) {
	                var uid = UID++;

	                _this.objectUID.set(object, uid);

	                return uid;
	            },

	            getUIDByObject: function getUIDByObject(object) {
	                if (!_this.objectUID.has(object)) {
	                    return _this.utils.createObjectUID(object);
	                }

	                return _this.objectUID.get(object);
	            },

	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            }
	        };

	        function debounce(func, wait) {
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

	        var handler = debounce(function () {
	            _this.eventStream.post('will-change-all');
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

	    _createClass(Baxter, [{
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            if (!owner || !key || !subscriber) {
	                throw new _entitiesError2['default']('can\'t subscribe variable without owner, key or callback function.');
	            }
	            var uid = this.utils.createKeyUID(owner, key);

	            this.eventStream.on('set', function (config) {
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
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            var result = new Set();

	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var dependency = _step.value;

	                    result.add(this.callstack.get(dependency));
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
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {*}
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(computed, callback) {
	            this.eventStream.on('get', callback);
	            var computingResult = computed();
	            this.eventStream.off('get', callback);

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
	            var _this2 = this;

	            var uid = this.utils.createKeyUID(owner, key);
	            var handler = function handler(resolve) {
	                _this2.callstack['delete'](uid);
	                if (!_this2.callstack.size) {
	                    _this2.eventStream.post('change-complete');
	                }
	                resolve();
	            };

	            this.eventStream.post('will-change', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });

	            this.callstack.set(uid, new Promise(function (resolve) {
	                /**
	                 * When will change chain is complete, then resolve
	                 */
	                _this2.eventStream.once('will-change-all', function () {
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
	            var _this3 = this;

	            var value = initialValue;
	            var uid = this.utils.createKeyUID(owner, key);

	            this.eventStream.post('registered', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });

	            Object.defineProperty(owner, key, {
	                set: function set(newValue) {
	                    if (newValue === value) {
	                        return false;
	                    }

	                    _this3.addToStack(owner, key, function () {
	                        var oldValue = value;

	                        value = newValue;

	                        _this3.eventStream.post('set', {
	                            uid: uid,
	                            owner: owner,
	                            key: key,
	                            value: value,
	                            oldValue: oldValue
	                        });
	                    });
	                },

	                get: function get() {
	                    _this3.eventStream.post('get', {
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
	         *
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

	            var value = undefined;
	            var oldValue = undefined;
	            var isComputing = false;
	            var computedUID = this.utils.createKeyUID(owner, key);
	            var dependencies = new Set();
	            var handleObservable = function handleObservable(handledValue) {
	                if (handledValue.uid === computedUID) {
	                    throw new _entitiesError2['default']('Circular dependencies detected on ' + key + ' value.');
	                }

	                dependencies.add(_this4.utils.createKeyUID(handledValue.owner, handledValue.key));

	                var handleChange = function handleChange() {
	                    /**
	                     * Add resolve to global stack
	                     */
	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            oldValue = value;
	                            value = computedObservable.call(owner);

	                            return value;
	                        }).then(function (value) {
	                            isComputing = false;

	                            if (oldValue === value) {
	                                return false;
	                            }

	                            _this4.eventStream.post('set', {
	                                uid: computedUID,
	                                owner: owner,
	                                key: key,
	                                value: value,
	                                oldValue: oldValue
	                            });
	                        });
	                    });
	                };

	                /**
	                 * Event listen: One of dependency will resolve later
	                 */
	                _this4.eventStream.on('will-change', function (willChange) {
	                    /**
	                     * Don't change anything if value if not current handled or variable is computing now
	                     */
	                    if (willChange.uid !== handledValue.uid || isComputing) {
	                        return false;
	                    }

	                    handleChange();

	                    isComputing = true;
	                });

	                _this4.subscribe(handledValue.owner, handledValue.key, function () {
	                    if (!isComputing) {
	                        handleChange();
	                    }
	                });
	            };

	            this.eventStream.post('registered', {
	                uid: computedUID,
	                owner: owner,
	                key: key
	            });

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

	            value = this.getDependencies(computedObservable, handleObservable);

	            Object.defineProperty(owner, key, {
	                get: function get() {
	                    _this4.eventStream.post('get', {
	                        uid: computedUID,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });

	                    return value;
	                },
	                set: function set(value) {
	                    if (value === value) {
	                        return;
	                    }
	                    throw new _entitiesError2['default']('you can\'t set value to computed');
	                }
	            });

	            return value;
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

	        this.channels = new Map();

	        this.context = defaultContext || this;
	    }

	    /**
	     * @name EventService.on
	     * @param {string} event - Event name
	     * @param {function} handler - Callback function with data as argument
	     */

	    _createClass(EventService, [{
	        key: "on",
	        value: function on(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }

	            if (!this.channels.has(event)) {
	                this.channels.set(event, new Set());
	            }

	            this.channels.get(event).add(handler);
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

	            if (!this.channels.has(event)) {
	                this.channels.set(event, new Set());
	            }

	            function handlerWrapper(data) {
	                that.off(event, handlerWrapper);
	                return handler(data);
	            }

	            this.channels.get(event).add(handlerWrapper);
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
	                return this.channels["delete"](event);
	            }

	            var eventHandlers = this.channels.get(event);

	            eventHandlers["delete"](handlerToDelete);

	            if (!eventHandlers.size) {
	                this.channels["delete"](event);
	            }
	        }

	        /**
	         * @name EventService.post
	         * @param {string} event
	         * @param {*} data
	         * @returns {Promise}
	         */
	    }, {
	        key: "post",
	        value: function post(event, data) {
	            var _this = this;

	            if (!event) {
	                throw new Error("Can't post undefined event");
	            }

	            if (!this.channels.has(event)) {
	                return new Promise(function (resolve) {
	                    return resolve();
	                });
	            }

	            if (event !== 'system:all') {
	                this.post('system:all', {
	                    event: event,
	                    data: data
	                });
	            }

	            return new Promise(function (resolve) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = _this.channels.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var handler = _step.value;

	                        handler.call(_this.context, data);
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

	                resolve();
	            });
	        }
	    }, {
	        key: "all",
	        value: function all(handler) {
	            var _this2 = this;

	            this.on('system:all', function (data) {
	                handler.call(_this2.context, data);
	            });
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