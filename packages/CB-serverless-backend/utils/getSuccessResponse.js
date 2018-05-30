const getResponse = (data) => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', },
  body: JSON.stringify(data)
});

export default getResponse;