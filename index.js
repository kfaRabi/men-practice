const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); /* to access req.body.param*/
const methodOverride = require('method-override'); /*to override post method to put/delete*/
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = 8080;
app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

function lout(obj){ console.log(obj); }

// load models
// Idea
require('./models/Idea');
const Idea = mongoose.model('ideas');

// get rid ot the 'depricated promise lib' warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/waidea', {
	useMongoClient: true,
}).then(() => lout("connected to mongodb")).catch((err) => lout(err));


// middlewares
// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

// middleware to respons with a flash message
app.use(flash());


// global variables (attached with responses)
const success_msg = "succeess", delete_msg = "deleted", update_msg = "updated";
app.use((req, res, next) => {
	res.locals.success_msg = req.flash(success_msg);
	res.locals.delete_msg = req.flash(delete_msg);
	res.locals.update_msg = req.flash(update_msg);
	next();
}); 


// routes
app.get('/', (req, res) => {
	// const heading = "Practice MEN"
	res.render('index');
});
// dummy about page
app.get('/about', (req, res) => {
	res.render('about');
});
// add an idea form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});
// handle form submission
app.post('/ideas', (req, res) => {
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
		const newUser = {
			title, details,
		};
		new  Idea(newUser).save().then(() => {
			req.flash(success_msg, "Your idea is added to the list.");
			res.redirect('/ideas');
		})
	}
});

// ideas index page
app.get('/ideas', (req, res) => {
	Idea.find({/*empty obj -> find all*/}).sort({
		date: 'desc',
	}).then(ideas => {
		res.render('ideas/index', {ideas});
	});
});

// get idea edit form
app.get('/ideas/edit/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.findOne({ _id }).then( idea => {
		res.render('ideas/edit', {idea});
	});
});

// update idea
app.put('/ideas/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.findOne({ _id })
	.then( idea => {
		const {title, details} = req.body;
		idea.title = title;
		idea.details = details;
		idea.save().then( () => {
			req.flash(update_msg, "Your Idea Has Been Updated"); 
			res.redirect('/ideas')
		});
	});
});

// delete idea
app.delete('/ideas/:_id', (req, res) => {
	const { _id } = req.params;
	Idea.deleteOne({ _id }).then( () => {
		// lout(dbRes);
		req.flash(delete_msg, "Idea Deleted.");
		res.redirect('/ideas');
	});
});