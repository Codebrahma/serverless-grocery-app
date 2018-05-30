import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();

/*
 * Gets a grocery based on groceryId
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  var documentClient = new AWS.DynamoDB.DocumentClient();

  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    callback(null, getErrorResponse(400, 'id should be provided'));
    return;
  }

  var params = {
    TableName: GROCERIES_TABLE_NAME,
    Key: {
      groceryId: event.queryStringParameters.id,
    }
  };

  const responsePromise = documentClient.get(params).promise();

  responsePromise
    .then((data) => {
      callback(null, getSuccessResponse(data));
    })
    .catch((err) => {
      callback(null, getErrorResponse(500, JSON.stringify(err.message)));
    });
}
