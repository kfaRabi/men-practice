const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const {isGuest} = require('../helpers/guest');

function lout(obj) { console.log(obj); }

// load models
require('../models/User');
const User = mongoose.model('users');

// set routes

// login form
router.get('/login', isGuest, (req, res) => {
	res.render('users/login');
});

// submit login form
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

// registration form
router.get('/register', isGuest, (req, res) => {
	res.render('users/register');
})


// return a hash given a string using bcrypt
function getHash(token){
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(token, salt);
	return hash;
	// bcrypt.genSalt(10, (err, salt) => {
	// 	bcrypt.hash(token, salt, (err, hash) => hash);
	// });
}

router.post('/register', (req, res) => {
	let errors = [];
	let {userName, email, password, passwordConfirm} = req.body;
	
	if(!userName){errors.push({text: "Name is require"});}
	if(!email){errors.push({text: "Valid email is required"});}
	if(!password || !passwordConfirm || !(password.length >= 4) || !(password === passwordConfirm)){
		passwordConfirm = "";
		errors.push({text: "Password and password confirmation must be same and 4 charcaters long"});
	}
	if(errors.length){
		res.render('users/register', {userName, email, password, passwordConfirm, errors});
	}
	else{
		password = getHash(password);
		const newUser = new User({userName, email, password});
		newUser.save().then( user => {
			req.flash("success", `${user.userName} is now registered. Please log in.`);
			res.redirect('/users/login');
		}).catch( err => {
			lout(err);
			req.flash("deleted", `Could not regester. Please try again.`);
			res.redirect('/users/register');
		});
	}
})

router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success", "You have been loged out");
	res.redirect('/users/login');
});


module.exports = router;