const renderServerError = (response, statusCode, errorMessage) => response(null, {
  statusCode: statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

export default renderServerError;