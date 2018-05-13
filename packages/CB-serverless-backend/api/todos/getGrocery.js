import mongoose from 'mongoose';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000',
});

const renderServerError = (response, errorMessage) => response(null, {
  statusCode: 500,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

const getResponse = (data) => {
  return { 
    statusCode: 200, 
    headers: { 'Content-Type' : 'application/json' }, 
    body: JSON.stringify(data) 
  };
}

export const getGrocery = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  var params = {
    TableName : 'grocery',
    Key: {
      groceryId: event.queryStringParameters.id,
    }
  };

  documentClient.get(params, function(err, data) {
    if (err) {
      console.log(err);
      renderServerError(callback, 'Unable to fetch! Try again later');
    }
    else {
      callback(null, getResponse(data));
    }
  });
}



