const getErrorResponse = (statusCode, errorMessage) => ({
  statusCode: statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

export default getErrorResponse;