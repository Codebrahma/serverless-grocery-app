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

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

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

	getCurrentCart(userId)
		.then(cart => {			
			cartItems = cart.Item.cartData;
      
			if (!cartItems || size(cartItems) < 1) {
				callback(null, getSuccessResponse({success: false, message: 'Cart is empty'}));
				return;
			}

			idToGroceryDataMapping = reduce(cartItems, (currentReducedValue, productInCart) => {
				return {
					...currentReducedValue,
					[productInCart.groceryId] : productInCart
				}
			}, {});			

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
			completeOrder = {
				'orderId': generateId(),
				'userId': userId,
				'orderItems': JSON.stringify(cartItems),
				'orderTotal': totalAmount,
				'orderStatus': 'PAYMENT_PENDING',
				'orderDate': new Date().toISOString()
			}			
			return createAndSaveOrder(completeOrder)
    })
    .then(() => {
      // Batch updates the sold and unsold quantities after placing an order
      return batchUpdateAvailableAndSoldQuantities(idToGroceryDataMapping);
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

const createAndSaveOrder = (orderData) => {
	const createOrderParams = {
		TableName: ORDERS_TABLE_NAME,
		Item: {
			...orderData
		}
	}

	return documentClient.put(createOrderParams).promise();
};

const getPricesOfCartItems = (cartData) => {
	const keysForBatchGet = map(cartData, item => ({'groceryId': item.groceryId}))
	const paramsForBatchGet = {
		RequestItems: {
			[GROCERIES_TABLE_NAME] : {
				Keys: keysForBatchGet,
				ProjectionExpression: 'groceryId, price'
			}
		}
	};

	return documentClient.batchGet(paramsForBatchGet).promise();
}

const getCurrentCart = (userId) => {
	const params = {
    TableName: CART_TABLE_NAME,
    Key: {
      'userId': parseInt(userId),
		},	
	};
	
	return documentClient.get(params).promise();
}

const batchUpdateAvailableAndSoldQuantities = (groceryIdToGroceryItemMap, revert = false) => {
  // Get Current Values of the cart for groceryId present in cartItems
  return getAvailableAndSoldQuantityForGroceries(groceryIdToGroceryItemMap)
    .then(data => Promise.all(
      map(data.Responses.grocery, (eachGrocery) => {
        // Based on id, merge groceryId, qty, soldQt, availableQty
        const getEntireCartDetail = {
          ...groceryIdToGroceryItemMap[eachGrocery.groceryId],
          ...eachGrocery,
        };
        const orderedQty = getEntireCartDetail.qty;
        // Updates the quantity
        return updateAvailableAndSoldQuantities(eachGrocery, orderedQty, revert);
      })
    ))
    .catch((err) => {
      console.log(err);
      return Promise.reject(JSON.stringify(err.message))
    })
}

// BatchGet the current sold and available quantities
const getAvailableAndSoldQuantityForGroceries = (cartItems) => {
  const keys = map(cartItems, (item) => {
    return {
      'groceryId': item.groceryId,
    }
  });
  const params = {
    RequestItems: {
      'grocery': {
        Keys: keys,
        ProjectionExpression: 'groceryId, availableQty, soldQty'
      }
    },
    
  }
  return documentClient.batchGet(params).promise();
}

// Reverts or cancel reverts of an item - current data
// By default revert is false which is - It is a placed order (opposite to cancelling)
const updateAvailableAndSoldQuantities = (currentData, orderedQty, revert = false) => {
  const factor = revert ? -1 : 1;
  // Update available and sold qty
  const updatedAvailableQty = currentData.availableQty - (factor * orderedQty);
  const updatedSoldQty = currentData.soldQty + (factor * orderedQty);

  const params = {
    TableName: 'grocery',
    Key: {
      'groceryId': currentData.groceryId,
    },
    UpdateExpression: `set availableQty=:availableQty, soldQty=:soldQty`,
    ExpressionAttributeValues:{
      ":availableQty": updatedAvailableQty > 0 ? updatedAvailableQty : 0,
      ":soldQty": updatedSoldQty > 0 ? updatedSoldQty : 0,
    },
    ReturnValues: "UPDATED_NEW"
  };

  return documentClient.update(params).promise();
}

