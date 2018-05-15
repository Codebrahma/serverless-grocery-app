import mongoose from 'mongoose';
import AWS from 'aws-sdk';
import _ from 'lodash';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';
import slice from 'lodash/slice';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import renderServerError from '../../utils/renderServerError';
import getResponse from '../../utils/getResponse';

awsConfigUpdate();

export const getGroceries = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const documentClient = new AWS.DynamoDB.DocumentClient();

  // Base params for scanning
  const getBaseGroceriesParams = () => ({
    TableName : 'grocery',
    ExpressionAttributeNames: {
      '#groceryId': 'groceryId',
      '#category': 'category',
      '#subCategory': 'subCategory',
      '#name': 'name',
      '#url': 'url',
    },
    ProjectionExpression: "#groceryId, #category, #subCategory, #name, #url",
  });

  // If category exists then return the listings for that category
  if (event.queryStringParameters && event.queryStringParameters.category) {
    const category = event.queryStringParameters.category
    var params = {
      ...getBaseGroceriesParams(),
      ExpressionAttributeValues: {
        ':category': category
      },
      FilterExpression: `#category = :category`,
    };

    const queryPromise = documentClient.scan(params).promise();

    queryPromise
      .then((data) => {
        callback(null, getResponse(data))
      })
      .catch((error) => {
        renderServerError(callback, 'Unable to fetch! Try again later')
      });
  } else {
    // If not scan and filter categories and bring the top 3 items,
    // Todo achieve the same with GSI Global Secondary index.
    // This is a very rough version
    var params = getBaseGroceriesParams();

    const queryPromise = documentClient.scan(params).promise();
    
    // Does a pre processing to show response
    queryPromise
      .then((data) => {
        const uniqueCategories = _
          .chain(data.Items)
          .uniqBy('category')
          .map(data => data.category)
          .map((category) => {
            const filteredResult = filter(data.Items, grocery => (grocery.category === category));
            return {
              category,
              groceries: slice(filteredResult, 0, 3),
            }
          })
          .value();
        
        // Sends the response
        callback(null, getResponse(uniqueCategories))
      })
      .catch((error) => {
        console.log(error);
        renderServerError(callback, 500, JSON.stringify(error.message))
      });
  }
}



