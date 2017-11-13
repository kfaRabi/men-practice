const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

function lout(obj) { console.log(obj); }

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.get('/registration', (req, res) => {
	res.render('users/registration');
})

module.exports = router;