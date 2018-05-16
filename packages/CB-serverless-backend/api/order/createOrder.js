import AWS from 'aws-sdk';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import merge from 'lodash/merge';
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
// import generatId from '../../utils/orderIdGenerator';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

export const main = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
  
  const {
    userId
	} = JSON.parse(event.body);
	console.log('UserId ' + userId);
	
	getCurrentCart(userId)
		.then(cart => {
			console.log('Cart ' + JSON.stringify(cart));
			createOrder(cart.Item);
		})
		.catch(error => callback(null, getErrorResponse(500, error)));
}

const createOrder = (cart) => {
	const items = JSON.parse(cart.cartData);
	console.log('Items ' + JSON.stringify(items));
	const idMappedCart = reduce(items, (currentValue, currentItem) => {
		return {
			...currentValue,
			[currentItem.groceryId] : currentItem
		}
	}, {});
	const keysForBatchGet = map(items, item => ({'groceryId': item.groceryId}))
	console.log('Keys ' + JSON.stringify(idMappedCart));
	
	const paramsForBatchGet = {
		RequestItems: {
			'grocery': {
				Keys: keysForBatchGet,
				ProjectionExpression: 'groceryId, price'
			}
		}
	};
	documentClient.batchGet(paramsForBatchGet, function(err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log('Batch data ' + JSON.stringify(data));
			
			const finalArray = map(data.Responses.grocery, function(element, index, array) {
				return {
					...element,
					...idMappedCart[element.groceryId]
				};
			});
			console.log('Final array ' + JSON.stringify(finalArray));
			
			const totalAmount = reduce(finalArray, (currentTotal, currentItem) => {
				return currentTotal + (currentItem.qty * currentItem.price)
			}, 0);
			console.log('Total ' + totalAmount);
		}
	});
	

	

	// const params = {
  //   TableName: 'orders',
  //   Items: {
	// 		orderId: generatId(),
	// 		userId: cart.userId,
	// 		items: cart.cartData,

	// 	},	
  // };
}

const getCurrentCart = (userId) => {
	const params = {
    TableName: 'cart',
    Key: {
      'userId': parseInt(userId),
		},	
  };
	return documentClient.get(params).promise();
}