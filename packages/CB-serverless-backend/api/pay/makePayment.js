import mongoose from 'mongoose';
import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';

// Put the stripe key in env
const stripe = require("stripe")('sk_test_JEVvHOWUTi2mP5IA1rebWCdi');

awsConfigUpdate();

export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  var documentClient = new AWS.DynamoDB.DocumentClient();
  
  const {
    email,
    id,
  } = JSON.parse(event.body);
  if (!email || !id) {
    callback(null, getErrorResponse(400, JSON.stringify({
      message: 'Both Email and id is required'
    })))
  }

  let amount = 500;
  
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



