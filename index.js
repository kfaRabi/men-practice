const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// load models
// Idea
require('./models/Idea');
const Idea = mongoose.model('ideas');

// get rid ot the 'depricated promise lib' warning
mongoose.Promise = global.Promise;
// connect to mongoose
mongoose.connect('mongodb://localhost/waidea', {
	useMongoClient: true,
})
.then(() => lout("connected to mongodb"))
.catch((err) => lout(err));

const PORT = 8080;

// middlewares
// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

function lout(obj){
	console.log(obj);
}

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
		res.send("done");
	}
});