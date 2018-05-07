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
    console.log('Database connection done');
    _Todo2.default.find({ userId: userId }, function (error, data) {
      console.log('Result', data);
      callback(null, { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: (0, _stringify2.default)(data) });
    });
  }).catch(function () {
    return renderServerError(callback, 'Unable to fetch todos! Try again later');
  });
};

/***/ }),

/***/ "./api/todos/processTodos.js":
/*!***********************************!*\
  !*** ./api/todos/processTodos.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/Users/codebrhama/Documents/projects/cb-serverless-starter/packages/CB-serverless-backend/api/todos/processTodos.js'");

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
exports.processTodos = exports.getAllTodos = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _getAllTodos = __webpack_require__(/*! ./api/todos/getAllTodos */ "./api/todos/getAllTodos.js");

var _processTodos = __webpack_require__(/*! ./api/todos/processTodos */ "./api/todos/processTodos.js");

exports.getAllTodos = _getAllTodos.getAllTodos;
exports.processTodos = _processTodos.processTodos;

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