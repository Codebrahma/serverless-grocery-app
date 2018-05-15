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

const onUserConfirmed = (reponseData, response) => {
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
			renderServerError(response, err)
		} else {
			response(null, getResponse({success: true}));
		}
	});
}

export const verifyUser = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const {username, verification} = JSON.parse(event.body);
	const data = {
		username,
		'code': verification
	}
	console.log(JSON.stringify(data))
	
	Auth.confirmSignUp(username, verification)
	.then(resposneData => onUserConfirmed(resposneData, callback))
	.catch(error => renderServerError(callback, error));
}
