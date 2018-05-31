import AWS from 'aws-sdk';
import map from 'lodash/map';
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import { GROCERIES_TABLE_NAME, GROCERIES_TOP_SELLING_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

const getBaseGroceriesParams = () => ({
	TableName : GROCERIES_TABLE_NAME,
	ExpressionAttributeNames: {
		'#groceryId': 'groceryId',
		'#category': 'category',
		'#soldQty': 'soldQty',
	},
	ProjectionExpression: "#groceryId, #category, #soldQty",
});

export const main = (event, content, callback) => {
	const updates = event.Records;
	const documentClient = new AWS.DynamoDB.DocumentClient();
	const queryPromise = documentClient.scan(getBaseGroceriesParams()).promise();

	queryPromise
      .then((data) => {
        const uniqueCategories = _
          .chain(data.Items)
          .uniqBy('category')
          .map(data => data.category)
          .map((category) => {
            const filteredResult = _
              .chain(data.Items)
              .filter(grocery => (grocery.category === category))
              .orderBy(['soldQty'], ['desc'])
              .take(3)
              .value();

            return {
              category,
              groceries: filteredResult,
            }
          })
          .value();
				const updateTopSellingTableParams = {
					TableName: GROCERIES_TOP_SELLING_TABLE_NAME,
					Item: {
						...uniqueCategories
					}
				}
				documentClient.put(updateTopSellingTableParams)
					.then(() => {
						console.log('Update successful');
					})
      })
      .catch((error) => {
						console.log('Update unsuccessful');        
      });
}