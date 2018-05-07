(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./api/profile/index.js":
/*!******************************!*\
  !*** ./api/profile/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createProfile = exports.getAllProfile = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _db = __webpack_require__(/*! ../../db */ "./db/index.js");

var _db2 = _interopRequireDefault(_db);

var _Profile = __webpack_require__(/*! ../../models/Profile */ "./models/Profile.js");

var _Profile2 = _interopRequireDefault(_Profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderServerError = function renderServerError(response, errorMessage) {
	return response(null, {
		statusCode: 500,
		headers: { 'Content-Type': 'application/json' },
		body: { success: false, error: errorMessage }
	});
};

var getAllProfile = exports.getAllProfile = function getAllProfile(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	(0, _db2.default)().then(function () {
		_Profile2.default.find({}, function (error, data) {
			callback(null, { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: (0, _stringify2.default)(data) });
		});
	}).catch(function () {
		return renderServerError(callback, 'Unable to fetch! Try again later');
	});
};

var createProfile = exports.createProfile = function createProfile(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	(0, _db2.default)().then(function () {
		_Profile2.default.create(JSON.parse(event.body), function (error, data) {
			callback(null, { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: (0, _stringify2.default)(data) });
		});
	}).catch(function () {
		return renderServerError(callback, 'Unable to create! Try again later');
	});
};

/***/ }),

/***/ "./api/todos/getAllTodos.js":
/*!**********************************!*\
  !*** ./api/todos/getAllTodos.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllTodos = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _db = __webpack_require__(/*! ../../db */ "./db/index.js");

var _db2 = _interopRequireDefault(_db);

var _Todo = __webpack_require__(/*! ../../models/Todo */ "./models/Todo.js");

var _Todo2 = _interopRequireDefault(_Todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderServerError = function renderServerError(response, errorMessage) {
  return response(null, {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: { success: false, error: errorMessage }
  });
};

var getAllTodos = exports.getAllTodos = function getAllTodos(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  var _ref = event.queryStringParameters || {},
      userId = _ref.userId;

  (0, _db2.default)().then(function () {
    _Todo2.default.find({ userId: userId }, function (error, data) {
      callback(null, { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: (0, _stringify2.default)(data) });
    });
  }).catch(function () {
    return renderServerError(callback, 'Unable to fetch todos! Try again later');
  });
};

/***/ }),

/***/ "./api/todos/index.js":
/*!****************************!*\
  !*** ./api/todos/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processTodos = exports.getAllTodos = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _getAllTodos = __webpack_require__(/*! ./getAllTodos */ "./api/todos/getAllTodos.js");

var _processTodos = __webpack_require__(/*! ./processTodos */ "./api/todos/processTodos.js");

exports.getAllTodos = _getAllTodos.getAllTodos;
exports.processTodos = _processTodos.processTodos;

/***/ }),

/***/ "./api/todos/processTodos.js":
/*!***********************************!*\
  !*** ./api/todos/processTodos.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processTodos = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _db = __webpack_require__(/*! ../../db */ "./db/index.js");

var _db2 = _interopRequireDefault(_db);

var _Todo = __webpack_require__(/*! ../../models/Todo */ "./models/Todo.js");

var _Todo2 = _interopRequireDefault(_Todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var processTodo = function processTodo(todo) {
  var promise = new _promise2.default(function (resolve, reject) {
    var query = { _id: todo.id };
    var isDeleteOperation = todo.deleted;
    var callback = function callback(err, data) {
      console.log('Error', err);
      console.log('data', data);
      err ? reject(err) : resolve(isDeleteOperation ? null : data._id);
    };

    if (todo.id) {
      isDeleteOperation ? _Todo2.default.findByIdAndRemove(query, callback) : _Todo2.default.findByIdAndUpdate(todo.id, todo, {}, callback);
    } else {
      _Todo2.default.create(todo, callback);
    }
  });
  return promise;
};

var renderServerError = function renderServerError(response, errorMessage) {
  return response(null, {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: { success: false, error: errorMessage }
  });
};

var processTodos = exports.processTodos = function processTodos(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  var _ref = JSON.parse(event.body) || {},
      todos = _ref.todos;

  (0, _db2.default)().then(function () {
    _promise2.default.all(todos.map(processTodo)).then(function (ids) {
      var todoIds = ids.filter(function (id) {
        return !!id;
      }).map(function (id) {
        return new _mongoose2.default.Types.ObjectId(id);
      });
      _Todo2.default.find({ '_id': { $in: todoIds } }, function (error, data) {
        return callback(null, { statusCode: 200, body: (0, _stringify2.default)(data) });
      });
    }).catch(function (e) {
      return renderServerError(callback, 'Unable to process todos! Try again later' + e.stack);
    });
  }).catch(function (e) {
    return renderServerError(callback, 'Unable to process todos! Try again later' + e.stack);
  });
};

/***/ }),

/***/ "./db/index.js":
/*!*********************!*\
  !*** ./db/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
var isConnected = void 0;

var dbConnection = function dbConnection() {
  console.log('isConnected at start ', isConnected);
  if (isConnected) {
    console.log('=> From Existing DB connection');
    return _promise2.default.resolve();
  }

  console.log('=> Using new DB connection');
  return _mongoose2.default.connect("mongodb://prasanna1211:hellomid125@cluster0-shard-00-00-m5ypw.mongodb.net:27017,cluster0-shard-00-01-m5ypw.mongodb.net:27017,cluster0-shard-00-02-m5ypw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin").then(function (db) {
    console.log('Connected : ' + db.connections[0].readyState);
    isConnected = db.connections[0].readyState;
  });
};

exports.default = dbConnection;

/***/ }),

/***/ "./handler.js":
/*!********************!*\
  !*** ./handler.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.processTodos = exports.getAllTodos = exports.createProfile = exports.getAllProfile = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _profile = __webpack_require__(/*! ./api/profile */ "./api/profile/index.js");

var _todos = __webpack_require__(/*! ./api/todos */ "./api/todos/index.js");

exports.getAllProfile = _profile.getAllProfile;
exports.createProfile = _profile.createProfile;
exports.getAllTodos = _todos.getAllTodos;
exports.processTodos = _todos.processTodos;

/***/ }),

/***/ "./models/Profile.js":
/*!***************************!*\
  !*** ./models/Profile.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var ProfileSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	password: String,
	country: String,
	subscribe: String,
	dateOfBirth: Date,
	married: String
});

exports.default = mongoose.model('Profile', ProfileSchema);

/***/ }),

/***/ "./models/Todo.js":
/*!************************!*\
  !*** ./models/Todo.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  userId: String
});

exports.default = mongoose.model('Todo', TodoSchema);

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/*!*******************************************************!*\
  !*** external "babel-runtime/core-js/json/stringify" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ "babel-runtime/core-js/promise":
/*!************************************************!*\
  !*** external "babel-runtime/core-js/promise" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support/register");

/***/ })

/******/ })));
//# sourceMappingURL=handler.js.map