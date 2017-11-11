const express = require('express');
var exphbs  = require('express-handlebars');

const app = express();

const PORT = 8080;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

function lout(obj){
	console.log(obj);
}

// routes
app.get('/', (req, res) => {
	const heading = "Practice MEN"
	// passing 'heading' to index.handlebars
	res.render('index', {heading});
});

app.get('/about', (req, res) => {
	res.render('about');
});

