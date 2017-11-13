const mongoose = require('mongoose');
const {Schema} = mongoose;

// create Schema
const UserSchema = new Schema({
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

// add schema to model
mongoose.model('users', UserSchema);