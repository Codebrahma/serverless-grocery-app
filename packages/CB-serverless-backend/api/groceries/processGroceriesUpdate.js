import AWS from 'aws-sdk';
import map from 'lodash/map';
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import { GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();
const getBaseGroceriesParams = () => ({
	TableName : GROCERIES_TABLE_NAME,
	ExpressionAttributeNames: {
		'#groceryId': 'groceryId',
		'#category': 'category',
		'#subCategory': 'subCategory',
		'#name': 'name',
		'#url': 'url',
		'#availableQty': 'availableQty',
		'#soldQty': 'soldQty',
	},
	ProjectionExpression: "#groceryId, #category, #subCategory, #name, #url, #availableQty, #soldQty",
});

export const main = (event, content, callback) => {
	const updates = event.Records;
	map(updates, anUpdate => {
		console.log(JSON.stringify(anUpdate));
	})

	
	
	
	
	
	
	// If not scan and filter categories and bring the top 3 items,
	// Todo achieve the same with GSI Global Secondary index.
	// This is a very rough version
	// var params = getBaseGroceriesParams();

	// const queryPromise = documentClient.scan(params).promise();
	
	// // Does a pre processing to show response
	// queryPromise
	// 	.then((data) => {
	// 		const uniqueCategories = _
	// 			.chain(data.Items)
	// 			.uniqBy('category')
	// 			.map(data => data.category)
	// 			.map((category) => {
	// 				const filteredResult = _
	// 					.chain(data.Items)
	// 					.filter(grocery => (grocery.category === category))
	// 					.orderBy(['soldQty'], ['desc'])
	// 					.take(3)
	// 					.value();

	// 				return {
	// 					category,
	// 					groceries: filteredResult,
	// 				}
	// 			})
	// 			.value();
			
	// 		// Sends the response
	// 		callback(null, getSuccessResponse(uniqueCategories))
	// 	})
	// 	.catch((error) => {
	// 		callback(null, getErrorResponse(500, JSON.stringify(error.message)));
	// 	});
}