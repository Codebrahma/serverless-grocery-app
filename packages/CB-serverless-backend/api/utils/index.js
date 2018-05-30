import AWS from 'aws-sdk';
import { CART_TABLE_NAME, GROCERIES_TABLE_NAME } from '../../dynamoDb/constants';
import awsConfigUpdate from '../../utils/awsConfigUpdate';
import map from 'lodash/map';

awsConfigUpdate();
const documentClient = new AWS.DynamoDB.DocumentClient();

/*
 * Cart cart Items
 * */
export const getCartQueryPromise = (userId) => {
  var params = {
    TableName: CART_TABLE_NAME,
    Key: {
      'userId': userId,
    },
  };

  return documentClient.get(params).promise();
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
      [GROCERIES_TABLE_NAME]: {
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
  if (updatedAvailableQty < 0) {
    return Promise.reject({
      message: `Not sufficient stock available for item id: ${currentData.groceryId}`,
    });
    // throw new Error(`Not sufficient stock available for item id: ${currentData.groceryId}`);
  }
  const params = {
    TableName: GROCERIES_TABLE_NAME,
    Key: {
      'groceryId': currentData.groceryId,
    },
    UpdateExpression: `set availableQty=:availableQty, soldQty=:soldQty`,
    ExpressionAttributeValues: {
      ":availableQty": updatedAvailableQty > 0 ? updatedAvailableQty : 0,
      ":soldQty": updatedSoldQty > 0 ? updatedSoldQty : 0,
    },
    ReturnValues: "UPDATED_NEW"
  };

  return documentClient.update(params).promise();
}


export const batchUpdateAvailableAndSoldQuantities = (groceryIdToGroceryItemMap, revert = false) => {
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
