import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

awsConfigUpdate();

export const updateStock = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
	const { groceryId, availableQty } = JSON.parse(event.body);

  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName : 'grocery',
    Key: {
      groceryId: parseInt(groceryId),
		},
		UpdateExpression: `set availableQty=:updatedQty`,
		ExpressionAttributeValues:{
			":updatedQty":availableQty,
		},
		ReturnValues: "UPDATED_NEW"
	};
	
	documentClient.update(params, function(error, data) {
		if (error) {
			getErrorResponse(callback, 500, error);
		} else {
			callback(null, getSuccessResponse({ success: true}));
		}
	})
};
