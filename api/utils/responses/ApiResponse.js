// const path = require('path');
// const ResponseHelper = require('../classes/ResponseHelper');

// /**
//  * Returns a ResponseHelper instance for a successful API response.
//  *
//  * @param {Object} _res - Express response object
//  * @param {number} [_statusCode=200] - HTTP status code
//  * @param {boolean} [_success=true] - Whether the operation was successful
//  * @param {string} [_message=''] - Message describing the outcome
//  * @param {Object|null} [_data=null] - Optional data payload
//  * @param {Object|string|null} [_error=null] - Optional error information
//  * @returns {ResponseHelper} ResponseHelper instance
//  *
//  * @example
//  * sendResponse(res, 200, true, 'User fetched', user).sendResponse();
//  */
// const sendResponse = (_res, _statusCode = 200, _success = true, _message = '', _data = null, _error = null) => {
//     return new ResponseHelper(_res, _statusCode, _success, _message, _data, _error);
// };

// /**
//  * Returns a ResponseHelper instance for an error API response.
//  *
//  * @param {Object} _res - Express response object
//  * @param {number} [_statusCode=500] - HTTP status code
//  * @param {boolean} [_success=false] - Usually false for errors
//  * @param {string} [_message=''] - Error message
//  * @param {Object|null} [_data=null] - Optional context or metadata
//  * @param {Object|string|null} [_error=null] - Detailed error info or stack trace
//  * @returns {ResponseHelper} ResponseHelper instance
//  *
//  * @example
//  * sendError(res, 400, false, 'Bad request', null, error).sendError();
//  */
// const sendError = (_res, _statusCode = 500, _success = false, _message = '', _data = null, _error = null) => {
//     return new ResponseHelper(_res, _statusCode, _success, _message, _data, _error);
// };

// /**
//  * Returns a ResponseHelper instance for rendering a server-side page.
//  *
//  * @param {Object} _res - Express response object
//  * @param {string} _filePath - Path to the view template
//  * @param {Object} [_renderData={}] - Data to pass to the template
//  * @returns {ResponseHelper} ResponseHelper instance
//  *
//  * @example
//  * renderPage(res, 'dashboard', { title: 'Dashboard', user }).renderPage();
//  */
// const renderPage = (_res, _filePath, _renderData = {}) => {
//     return new ResponseHelper(_res).renderPage(_filePath, _renderData);
// };

// module.exports = { sendResponse, sendError, renderPage };

const path = require("path");
const sendResponse = (
  _res,
  _statusCode = 200,
  _success = false,
  _message = "",
  _data = null,
  _error = null
) => {
  return _res.status(_statusCode).json({
    statusCode: _statusCode,
    success: _success,
    message: _message,
    data: _data,
    error: _error,
  });
};

const sendError = (
  _res,
  _statusCode = 500,
  _success = false,
  _message = "",
  _data = null,
  _error = null
) => {
  return _res.status(_statusCode).json({
    statusCode: _statusCode,
    success: _success,
    message: _message,
    data: _data,
    error: _error,
  });
};

module.exports = { sendResponse, sendError };
