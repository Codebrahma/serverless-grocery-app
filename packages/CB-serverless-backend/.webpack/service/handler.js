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

/***/ "./api/todos/getGroceries.js":
/*!***********************************!*\
  !*** ./api/todos/getGroceries.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroceries = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _awsSdk = __webpack_require__(/*! aws-sdk */ "aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000'
});

var renderServerError = function renderServerError(response, errorMessage) {
  return response(null, {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: { success: false, error: errorMessage }
  });
};

var getResponse = function getResponse(data) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: (0, _stringify2.default)(data)
  };
};

var getGroceries = exports.getGroceries = function getGroceries(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  var documentClient = new _awsSdk2.default.DynamoDB.DocumentClient();
  var category = event.queryStringParameters.category;
  var params = {
    TableName: 'grocery',
    ExpressionAttributeNames: {
      '#groceryId': 'groceryId',
      '#category': 'category',
      '#subCategory': 'subCategory',
      '#name': 'name',
      '#url': 'url'
    },
    ExpressionAttributeValues: {
      ':category': category
    },
    FilterExpression: '#category = :category',
    ProjectionExpression: "#groceryId, #category, #subCategory, #name, #url"
  };
  documentClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
      renderServerError(callback, 'Unable to fetch! Try again later');
    } else {
      callback(null, getResponse(data));
    }
  });
};

/***/ }),

/***/ "./api/todos/getGrocery.js":
/*!*********************************!*\
  !*** ./api/todos/getGrocery.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGrocery = undefined;

var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ "babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _mongoose = __webpack_require__(/*! mongoose */ "mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _awsSdk = __webpack_require__(/*! aws-sdk */ "aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000'
});

var renderServerError = function renderServerError(response, errorMessage) {
  return response(null, {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: { success: false, error: errorMessage }
  });
};

var getResponse = function getResponse(data) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: (0, _stringify2.default)(data)
  };
};

var getGrocery = exports.getGrocery = function getGrocery(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  var documentClient = new _awsSdk2.default.DynamoDB.DocumentClient();

  var params = {
    TableName: 'grocery',
    Key: {
      groceryId: event.queryStringParameters.id
    }
  };

  documentClient.get(params, function (err, data) {
    if (err) {
      console.log(err);
      renderServerError(callback, 'Unable to fetch! Try again later');
    } else {
      callback(null, getResponse(data));
    }
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
exports.getGroceries = exports.getGrocery = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _getGrocery = __webpack_require__(/*! ./getGrocery */ "./api/todos/getGrocery.js");

var _getGroceries = __webpack_require__(/*! ./getGroceries */ "./api/todos/getGroceries.js");

exports.getGrocery = _getGrocery.getGrocery;
exports.getGroceries = _getGroceries.getGroceries;

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
exports.getGroceries = exports.getGrocery = undefined;

__webpack_require__(/*! source-map-support/register */ "source-map-support/register");

var _todos = __webpack_require__(/*! ./api/todos */ "./api/todos/index.js");

exports.getGrocery = _todos.getGrocery;
exports.getGroceries = _todos.getGroceries;

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/*!*******************************************************!*\
  !*** external "babel-runtime/core-js/json/stringify" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

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