import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { CART_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;  
  if (!event.queryStringParameters) {
    getErrorResponse(callback, 400, 'userId is not present in params')
  }
  
	getCartQueryPromise(event.queryStringParameters.userId)
		.then((data) => {
			callback(null, getSuccessResponse(data))
		})
		.catch((error) => {
			console.log(error.message);
			callback(null, getErrorResponse(500, JSON.stringify(error.message)))
		});
}

export const getCartQueryPromise = (userId) => {
	var params = {
    TableName: CART_TABLE_NAME,
    Key: {
      'userId': userId,
    },
  };

	return documentClient.get(params).promise();
}
