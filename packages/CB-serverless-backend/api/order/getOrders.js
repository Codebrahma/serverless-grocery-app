import AWS from 'aws-sdk';
import _ from 'lodash';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { ORDERS_TABLE_NAME, GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();

/*
 * Get orders based on ids
 * Each order will be having details about each of the item
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!event.queryStringParameters || !event.queryStringParameters.userId) {
    callback(null, getErrorResponse(400, 'userId is not present in params'))
    return;
  }

  const documentClient = new AWS.DynamoDB.DocumentClient();
  const userId = event.queryStringParameters.userId;
  const queryOrdersParams = {
    TableName: ORDERS_TABLE_NAME,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
    },
    ExpressionAttributeValues: {
      ":userId": userId
    }
  }

  var getGroceryParams = (id) => ({
    TableName: GROCERIES_TABLE_NAME,
    Key: {
      groceryId: id,
    }
  });

  const groceryPromise = id => documentClient.get(getGroceryParams(id)).promise();

  documentClient.query(queryOrdersParams).promise()
    .then(dbResultSet => {
      const result = map(dbResultSet.Items, async (item) => {
        const groceryListPromise = map(item.orderItems, (value, groceryId) => {
          return groceryPromise(groceryId);
        });
        var itemList = await Promise.all(groceryListPromise);

        const updatedItemList = itemList.map(({ Item }) => {
          return Item;
        });
        // Creates a current order list
        const currentOrderList = map(updatedItemList, (eachItem) => {
          return {
            ...eachItem,
            ...item.orderItems[eachItem.groceryId],
          };
        });

        const eachOrder = {
          ...item,
          orderItems: currentOrderList,
        }

        // Returns the list with promise
        return Promise.resolve(eachOrder);
      });
      // Promise which returns all order data
      Promise
        .all(result)
        .then((data) => {
          callback(null, getSuccessResponse(data));
        })
    })
    .catch(error => callback(null, getErrorResponse(500, JSON.stringify(error.message))))
}