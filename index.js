const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

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

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

function lout(obj){
	console.log(obj);
}

// routes
app.get('/', (req, res) => {
	// const heading = "Practice MEN"
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

