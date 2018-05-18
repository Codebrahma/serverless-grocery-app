import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import { GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';

awsConfigUpdate();

export const main = (event, content, callback) => {
	console.log('Called this with update');
	console.log(JSON.stringify(event));

	callback(null, { });
}