const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	password: String,
	country: String,
	subscribe: String,
	dateOfBirth: Date,
	married: String,
});

export default mongoose.model('Profile', ProfileSchema);