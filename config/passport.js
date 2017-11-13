const {Strategy} = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function lout(obj) { console.log(obj); }

// load User Model
const User = mongoose.model('users');

// this function will be called form index.js
module.exports = function(passport) {
	passport.use(new Strategy({usernameField: 'email'}, (email, password, done) => {
		// find user
		User.findOne({email}).then(user => {
			// lout(password);
			if(!user){
				return done(null, false, {message: "No User Found"});
			}
			// match password
			const matched = bcrypt.compareSync(password, user.password);
			// lout("matched, " + matched);
			if(matched){
				return done(null, user);
			}
			else{
				return done(null, false, {message: "Password Did Not Match"});
			}
		}).catch( err => lout(err));
	}));
	// 
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	});
});
}