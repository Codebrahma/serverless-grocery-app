import mongoose from 'mongoose';
import connectToDatabase from '../../db';
import Profile from '../../models/Profile';

const renderServerError = (response, errorMessage) => response(null, {
	statusCode: 500,
	headers: { 'Content-Type': 'application/json' },
	body: { success: false, error: errorMessage },
});

export const getAllProfile = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(() => {
		Profile.find({}, (error, data) => {
			callback(null, { statusCode: 200, headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(data) })
		});
	})
	.catch(() => renderServerError(callback, 'Unable to fetch! Try again later'));
}

export const createProfile = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	connectToDatabase().then(() => {
		Profile.create(JSON.parse(event.body), (error, data) => {
			callback(null, { statusCode: 200, headers: { 'Content-Type' : 'application/json' }, body: JSON.stringify(data) })
		});
	})
	.catch(() => renderServerError(callback, 'Unable to create! Try again later'));
}