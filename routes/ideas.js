const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

function lout(obj){ console.log(obj); }

// load models
// Idea
require('../models/Idea');
const Idea = mongoose.model('ideas');

// routes
// get idea form
router.get('/add', (req, res) => {
	res.render('ideas/add');
});
// handle form submission
router.post('/', (req, res) => {
	let errors = [];
	let title, details;
	if(!req.body.title){
		errors.push({ text: "Please Enter A Title"});
	}
	else {
		title = req.body.title;
	}
	if(!req.body.details){
		errors.push({ text: "Please Add Some Details"});
	}
	else {
		details = req.body.details;
	}
	if(errors.length > 0) {
		res.render('/ideas/add', {
			errors, title, details,
		});
	}
	else{
		const {title, details} = req.body;
		const newUser = {
			title, details,
		};
		new  Idea(newUser).save().then(() => {
			req.flash("success", "Your idea is added to the list.");
			res.redirect('/ideas');
		})
	}
});

// ideas index page
router.get('/', (req, res) => {
	Idea.find({/*empty obj -> find all*/}).sort({
		date: 'desc',
	}).then(ideas => {
		res.render('ideas/index', {ideas});
	});
});

// get idea edit form
router.get('/edit/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.findOne({ _id }).then( idea => {
		res.render('ideas/edit', {idea});
	});
});

// update idea
router.put('/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.findOne({ _id })
	.then( idea => {
		const {title, details} = req.body;
		idea.title = title;
		idea.details = details;
		idea.save().then( () => {
			req.flash("updated", "Your Idea Has Been Updated"); 
			res.redirect('/ideas')
		});
	});
});

// delete idea
router.delete('/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.deleteOne({ _id }).then( () => {
		// lout(dbRes);
		req.flash("deleted", "Idea Deleted.");
		res.redirect('/ideas');
	});
});


module.exports = router;