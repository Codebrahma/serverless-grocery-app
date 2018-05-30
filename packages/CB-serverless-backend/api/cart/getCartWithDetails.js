import AWS from 'aws-sdk';
import size from 'lodash/size';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { getCartQueryPromise } from '../utils';
import { CART_TABLE_NAME, GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

/* 
 * Gets cart items with each grocery details
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
    
  if (!event.queryStringParameters) {
		getErrorResponse(callback, 400, 'userId is not present in params');
		return;
	}
	
	let groceryIdToGroceryDataMapping;
	getCartQueryPromise(event.queryStringParameters.userId)
		.then((cart) => {
      
			const cartItems = cart.Item ? cart.Item.cartData : [];
      
			if (!cart || size(cartItems) < 1) {
				callback(null, getSuccessResponse({success: false, message: 'Cart is empty'}));
				return;
			}
			groceryIdToGroceryDataMapping = reduce(cartItems, (currentReducedValue, productInCart) => {
				return {
					...currentReducedValue,
					[productInCart.groceryId] : productInCart
				}
			}, {});
			return getCartItemDetails(cartItems);
		})
		.then(dbResult => dbResult.Responses.grocery)
		.then(cartItemsWithDetails => {
			const fullCartDetails = map(cartItemsWithDetails, eachCartItemData => ({
				...eachCartItemData,
				...groceryIdToGroceryDataMapping[eachCartItemData.groceryId]
			}))
			callback(null, getSuccessResponse(fullCartDetails))
		})
		.catch((error) => {
			console.log(error.message);
			callback(null, getErrorResponse(500, JSON.stringify(error.message)))
		});
}

const getCartItemDetails = (cartData) => {
	const keysForBatchGet = map(cartData, item => ({'groceryId': item.groceryId}))
	const paramsForBatchGet = {
		RequestItems: {
			[GROCERIES_TABLE_NAME] : {
				Keys: keysForBatchGet
			}
		}
	};

	return documentClient.batchGet(paramsForBatchGet).promise();
}
