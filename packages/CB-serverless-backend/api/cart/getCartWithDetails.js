import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { CART_TABLE_NAME, GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
  if (!event.queryStringParameters) {
    getErrorResponse(callback, 400, 'userId is not present in params')
  }
  
  var cartQueryParams = {
    TableName: CART_TABLE_NAME,
    Key: {
      userId: parseInt(event.queryStringParameters.userId),
    },
  };

	documentClient.get(cartQueryParams).promise()
		.then((data) => {
			const cartItems = cart.Item.cartData;
      
			if (!cartItems || size(cartItems) < 1) {
				callback(null, getSuccessResponse({success: false, message: 'Cart is empty'}));
				return;
			}
			return getCartItemDetails(cartItems);
		})
		.then(dbResult => dbResult.Responses.grocery)
		.then(cartItemsWithDetails => callback(null, getSuccessResponse(cartItemsWithDetails)))
		.catch((error) => {
			console.log(error.message);
			callback(null, getErrorResponse(500, JSON.stringify(error.message)))
		});
}

const getCartItemDetails = (cartData) => {
	const keysForBatchGet = map(cartData, item => ({'groceryId': item.groceryId}))
	const paramsForBatchGet = {
		RequestItems: {
			[GROCERIES_TABLE_NAME] : {
				Keys: keysForBatchGet
			}
		}
	};

	return documentClient.batchGet(paramsForBatchGet).promise();
}


