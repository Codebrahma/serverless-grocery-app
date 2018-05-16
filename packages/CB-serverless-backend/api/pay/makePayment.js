import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

// Put the stripe key in env
const stripe = require("stripe")('sk_test_JEVvHOWUTi2mP5IA1rebWCdi');
var documentClient = new AWS.DynamoDB.DocumentClient();

awsConfigUpdate();

const getAmountFromOrderId = (orderId) => {
  const params = {
    TableName: 'order',
    Key: {
      ':orderId': orderId
    },
    ProjectionExpression: "orderId, orderTotal",
  }

  const queryPromise = documentClient.scan(params).promise();
  
  return queryPromise
    .then((data) => {
      return {
        success: true,
        data,
      }
    })
    .catch((error) => {
      return {
        succes: false,
      }
    });
}

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const {
    email,
    id,
    orderId,
  } = JSON.parse(event.body);
  if (!email || !id || !orderId) {
    callback(null, getErrorResponse(400, JSON.stringify({
      message: 'Both Email and id is required'
    })))
  }

  let amount; 
  getAmountFromOrderId(orderId)
    .then((response) => {
      if (response.success) {
        console.log('amount ', response.data);
      }
    });
  console.log('amount ', amount)
  stripe.customers.create({
    email,
    card: id,
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .then((charge) => {
    callback(null, getSuccessResponse({
      success: true,
    }))
  })
  .catch((err) => {
    callback(null, getErrorResponse(500, JSON.stringify(err.message)))
  });
}



