import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { CART_TABLE_NAME } from '../../dynamoDb/constants';

import { getCartQueryPromise } from '../utils';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

/* 
 * Gets the cart details of an user
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!event.queryStringParameters) {
    callback(null, getErrorResponse(400, 'userId is not present in params'))
    return;
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
