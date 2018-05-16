import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import _ from 'lodash';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';
import slice from 'lodash/slice';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

awsConfigUpdate();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const documentClient = new AWS.DynamoDB.DocumentClient();
  
  const {
    userId,
    cartData,
  } = JSON.parse(event.body);
  console.log(userId, cartData, typeof cartData);
  var params = {
    TableName: 'cart',
    Key: {
      userId: parseInt(userId),
    },
    ExpressionAttributeNames: {
      '#cartData': 'cartData'
    },
    ExpressionAttributeValues: {
      ':cartData': JSON.stringify(cartData),
    },
    UpdateExpression: 'SET #cartData = :cartData',
    ReturnValues: 'ALL_NEW',
  };

    const queryPromise = documentClient.update(params).promise();

    queryPromise
      .then((data) => {
        callback(null, getSuccessResponse(data))
      })
      .catch((error) => {
        console.log(error.message);
        callback(null, getErrorResponse(500, JSON.stringify(error.message)))
      });
}



