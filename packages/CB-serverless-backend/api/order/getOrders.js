import AWS from 'aws-sdk';
import _ from 'lodash';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { ORDERS_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
	if (!event.queryStringParameters || !event.queryStringParameters.userId) {
		callback(null, getErrorResponse(400, 'userId is not present in params'))
		return;
	}
	
	const documentClient = new AWS.DynamoDB.DocumentClient();
	const userId = event.queryStringParameters.userId;
	const queryOrdersParams = {
		TableName : ORDERS_TABLE_NAME,
		KeyConditionExpression: "#userId = :userId",
		ExpressionAttributeNames: {
			"#userId": "userId",
		},
		ExpressionAttributeValues: {
			":userId": userId
		}
	}

	documentClient.query(queryOrdersParams).promise()
		.then(dbResultSet => {
			callback(null, getSuccessResponse(dbResultSet.Items))
		})
		.catch(error => callback(null, getErrorResponse(500, JSON.stringify(error.message))))
}