const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// import custom middlewares
const {loginCheck} = require('../helpers/auth');
const {isOwner} = require('../helpers/ownership');
function lout(obj){ console.log(obj); }

// load models
// Idea
require('../models/Idea');
const Idea = mongoose.model('ideas');

// routes
// get idea form
router.get('/add', loginCheck, (req, res) => {
	res.render('ideas/add');
});
// handle form submission
router.post('/', loginCheck, (req, res) => {
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
		res.render('ideas/add', {
			errors, title, details,
		});
	}
	else{
		const {title, details} = req.body;
		const user = req.user.id;
		const newIdea = {
			title, details, user,
		};
		new  Idea(newIdea).save().then(() => {
			req.flash("success", "Your idea is added to the list.");
			res.redirect('/ideas');
		})
	}
});

// ideas index page
router.get('/', loginCheck, (req, res) => {
	// Idea.find({/*empty obj -> find all*/}).sort({
	Idea.find({user: req.user.id}).sort({
		date: 'desc',
	}).then(ideas => {
		res.render('ideas/index', {ideas});
	});
});

// get idea edit form
router.get('/edit/:_id', loginCheck, isOwner, (req, res) => {
	const { _id } = req.params;
	Idea.findOne({ _id }).then( idea => {
		res.render('ideas/edit', {idea});
	});
});

// update idea
router.put('/:_id', loginCheck, isOwner, (req, res) => {
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
router.delete('/:_id', loginCheck, isOwner, (req, res) => {
	const { _id } = req.params;
	Idea.deleteOne({ _id }).then( () => {
		// lout(dbRes);
		req.flash("deleted", "Idea Deleted.");
		res.redirect('/ideas');
	});
});


module.exports = router;	