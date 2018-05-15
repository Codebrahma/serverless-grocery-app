import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

awsConfigUpdate();

export const updateStock = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
	const dataToUpdate = JSON.parse(event.body);
  const documentClient = new AWS.DynamoDB.DocumentClient();	
	const promiseArray = [];

	dataToUpdate.forEach(rowData => {
		const params = {
			TableName : 'grocery',
			Key: {
				groceryId: parseInt(rowData.groceryId),
			},
			UpdateExpression: `set availableQty=:updatedQty`,
			ExpressionAttributeValues:{
				":updatedQty":rowData.availableQty,
			},
			ReturnValues: "UPDATED_NEW"
		};
		promiseArray.push(documentClient.update(params).promise())
	});

	Promise.all(promiseArray)
		.then(data => callback(null, getSuccessResponse({success: true})))
		.catch(error => getErrorResponse(callback, 500, error))
};
