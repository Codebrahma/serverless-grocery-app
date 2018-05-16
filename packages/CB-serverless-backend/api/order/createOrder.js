import AWS from 'aws-sdk';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import size from 'lodash/size';
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
			callback(null, getSuccessResponse({
				success: true,
				orderId: completeOrder.orderId,
				orderTotal: completeOrder.orderTotal
			 }));
		})
		.catch(error => callback(null, getErrorResponse(500, error)));
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