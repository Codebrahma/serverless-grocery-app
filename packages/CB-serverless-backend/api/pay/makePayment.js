import AWS from 'aws-sdk';

import awsConfigUpdate from '../../utils/awsConfigUpdate';
import getErrorResponse from '../../utils/getErrorResponse';
import getSuccessResponse from '../../utils/getSuccessResponse';
import { ORDERS_TABLE_NAME } from '../../dynamoDb/constants';
import { UpdateOrderStatus } from '../order/cancelOrder';

// Put the stripe key in env
const stripe = require("stripe")('sk_test_JEVvHOWUTi2mP5IA1rebWCdi');

awsConfigUpdate();

const documentClient = new AWS.DynamoDB.DocumentClient();

const getAmountFromOrderId = (orderId, userId) => {
  const params = {
    TableName: ORDERS_TABLE_NAME,
    Key: {
      'userId': userId,
      'orderId': orderId,
    },

    ProjectionExpression: "orderId, orderTotal",
  }

  return documentClient.get(params).promise();
}

/*
 * API which makes payment to stripe
 * */
export const main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    email,
    stripeId,
    orderId,
    userId
  } = JSON.parse(event.body);

  if (!email || !stripeId || !orderId) {
    callback(null, getErrorResponse(400, JSON.stringify({
      message: 'Both Email and id is required'
    })))
    return;
  }

  let amount;

  getAmountFromOrderId(orderId, userId)
    .then((response) => {
      amount = response.Item.orderTotal;
    })
    .catch((error) => {
      callback(null, getErrorResponse(500, JSON.stringify(error.message)))
    })

  stripe.customers.create({
    email,
    card: stripeId,
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
      }))
    .then(() => {
      UpdateOrderStatus(userId, orderId, 'COMPLETED')
    })
    .then(() => {
      callback(null, getSuccessResponse({
        success: true,
      }))
    })
    .catch((err) => {
      callback(null, getErrorResponse(500, JSON.stringify(err.message)))
    });
}
