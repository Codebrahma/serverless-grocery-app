import AWS from 'aws-sdk';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import size from 'lodash/size';
import findIndex from 'lodash/findIndex'
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import generateId from '../../utils/orderIdGenerator';
import { ORDERS_TABLE_NAME, GROCERIES_TABLE_NAME, CART_TABLE_NAME } from '../../dynamoDb/constants';
import { batchUpdateAvailableAndSoldQuantities } from '../utils';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

/*
 * Cancels an order
 * Returns the stock to the stock
 * Sets the status of order to "Cancelled"
 * */
export const main = (event, context, callback) => {
  const {
		userId,
    orderId
	} = JSON.parse(event.body);

  if (!userId || !orderId) {
    callback(null, getErrorResponse(400, 'Missing or invalid data'));
    return;
  }

  let orderToUpdate;
  getOrderDetails(userId, orderId)
    .then(dbResultSet => dbResultSet.Item)
    .then(orderData => {
      if (!orderData) {
        throw {
          message: 'Cannot find the order for given order id'
        };
      }

      orderToUpdate = orderData;
      
      // Updates order status
      return UpdateOrderStatus(userId, orderId, 'CANCELLED')
        .catch(err => {
          return Promise.reject(err);
        })
        .then(() => batchUpdateAvailableAndSoldQuantities(orderToUpdate.orderItems, true))
        .catch(err => {
          return Promise.reject(err);
        })
    })
    .then(() => callback(null, getSuccessResponse({ success: true })))
    .catch(err => {
      callback(null, getErrorResponse(400, `Error updating order. ${err.message}`));
      return;
    });
}

// changes order status
export const UpdateOrderStatus = (userId, orderId, orderStatus) => {
  var updateParams = {
    TableName: ORDERS_TABLE_NAME,
    Key: {
      "userId": userId,
      "orderId": orderId,
    },
    UpdateExpression: "set orderStatus=:newStatus",
    ExpressionAttributeValues: {
      ":newStatus": orderStatus,
    },
    ReturnValues: "UPDATED_NEW"
  };
  return documentClient.update(updateParams).promise();
}

// Gets the order details first to update
const getOrderDetails = (userId, orderId) => {
  const queryOrderParams = {
    TableName: ORDERS_TABLE_NAME,
    Key: {
      "userId": userId,
      "orderId": orderId,
    }
  }

  return documentClient.get(queryOrderParams).promise();
}