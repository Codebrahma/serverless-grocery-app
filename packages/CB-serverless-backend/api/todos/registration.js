import AWS from 'aws-sdk';
import { Auth } from 'aws-amplify';

AWS.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000',
});

const renderServerError = (response, errorMessage) => response(null, {
  statusCode: 500,
  headers: { 'Content-Type': 'application/json' },
  body: { success: false, error: errorMessage },
});

const getResponse = (data) => {
  return { 
    statusCode: 200, 
    headers: { 'Content-Type' : 'application/json' }, 
    body: JSON.stringify(data) 
  };
}

const onRegistrationSuccess = (userData, response) => {
	let documentClient = new AWS.DynamoDB.DocumentClient();

	let params = {
		TableName: 'user',
		Item: {
			'userId' : userData.userSub,
			'email' : userData.user.username,
			'firstname' : userData.userName,
			'lastname' : userData.lastName,
			'mobile' : userData.mobile,
			'verified': false
		}
	};

	documentClient.put(params, function(err, data) {
		if (err) {
			console.log(err)
			
			renderServerError(response, err)
		} else {
			response(null, getResponse({success: true}));
		}
	});
}

export const registerUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
	const data = JSON.parse(event.body);
	const { username, password } = data;

	Auth.signUp({
		username,
		password,
	}).then(responseData => {
		onRegistrationSuccess(responseData, callback)
	})
	.catch(err => renderServerError(callback, err));
}

const verfiyUser = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const data = JSON.parse(event.body);
	
	let documentClient = new AWS.DynamoDB.DocumentClient();
	var params = {
    TableName: 'user',
    Key:{
        'userId': data.userId
    },
    UpdateExpression: "set verified=:a",
    ExpressionAttributeValues:{
        ":a":true,
    },
    ReturnValues:"UPDATED_NEW"
	};
	documentClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
	});
}

// export default {
// 	registerUser,
// 	verfiyUser,
// }