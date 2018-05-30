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
 * Creates an order
 * Retrives the current cart items and creates an order
 * Updates the order and stocks
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    userId
	} = JSON.parse(event.body);
  if (!userId) {
    callback(null, getErrorResponse(400, 'Missing or invalid data'));
    return;
  }
  let idToGroceryDataMapping, cartItems, completeOrder;

  // Retrives the current Cart
  getCurrentCart(userId)
    .then(cart => {
      cartItems = cart.Item.cartData;

      if (!cartItems || size(cartItems) < 1) {
        callback(null, getSuccessResponse({ success: false, message: 'Cart is empty' }));
        return;
      }

      idToGroceryDataMapping = reduce(cartItems, (currentReducedValue, productInCart) => {
        return {
          ...currentReducedValue,
          [productInCart.groceryId]: productInCart
        }
      }, {});
      // Modifies the structure for easy manipulation
      return getPricesOfCartItems(cartItems);
    })
    .then(dbData => dbData.Responses.grocery)
    .then(cartItemsWithPrice => map(cartItemsWithPrice, cartItem => {
      return {
        ...cartItem,
        ...idToGroceryDataMapping[cartItem.groceryId]
      }
    })
    )
    .then(cartItemsWithPriceAndQty => reduce(cartItemsWithPriceAndQty, (currentTotal, currentItem) => {
      return currentTotal + (currentItem.qty * currentItem.price)
    }, 0)
    )
    .then(totalAmount => {
      // Completes the order with the current state and pending payment
      completeOrder = {
        'orderId': generateId(),
        'userId': userId,
        'orderItems': idToGroceryDataMapping,
        'orderTotal': totalAmount,
        'orderStatus': 'PAYMENT_PENDING',
        'orderDate': new Date().toISOString()
      }
      // First update the stock
      // If success then place the order
      // If error then don't place the order
      return batchUpdateAvailableAndSoldQuantities(idToGroceryDataMapping)
        .catch((err) => {
          // Rejecting only with err since err.message has been extracted in the batch update function
          return Promise.reject(err);
        })
        // Creates the order
        .then(() => createAndSaveOrder(completeOrder))
        .catch((err) => {
          return Promise.reject(err.message);
        })

    })
    .then(() => {
      callback(null, getSuccessResponse({
        success: true,
        orderId: completeOrder.orderId,
        orderTotal: completeOrder.orderTotal
      }));
    })
    .catch(error => {
      console.log(error);
      callback(null, getErrorResponse(500, error))
    });
}

// Order creation Query Promise
const createAndSaveOrder = (orderData) => {
  const createOrderParams = {
    TableName: ORDERS_TABLE_NAME,
    Item: {
      ...orderData
    }
  }

  return documentClient.put(createOrderParams).promise();
};

// Get Cart Item Price Query Promise
const getPricesOfCartItems = (cartData) => {
  const keysForBatchGet = map(cartData, item => ({ 'groceryId': item.groceryId }))
  const paramsForBatchGet = {
    RequestItems: {
      [GROCERIES_TABLE_NAME]: {
        Keys: keysForBatchGet,
        ProjectionExpression: 'groceryId, price'
      }
    }
  };

  return documentClient.batchGet(paramsForBatchGet).promise();
}

// Get CurrentCart Query Promise
const getCurrentCart = (userId) => {
  const params = {
    TableName: CART_TABLE_NAME,
    Key: {
      'userId': userId,
    },
  };

  return documentClient.get(params).promise();
}
