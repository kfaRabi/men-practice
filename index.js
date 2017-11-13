const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); /* to access req.body.param*/
const methodOverride = require('method-override'); /*to override post method to put/delete*/
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const PORT = 8080;
app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

function lout(obj){ console.log(obj); }

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

// setup static folder
app.use(express.static(path.join( __dirname, 'public')));

// bind route and model
const ideas = require('./routes/ideas');
app.use('/ideas', ideas);

const users = require('./routes/users');
app.use('/users', users);

// root route
app.get('/', (req, res) => {
	res.render('index');
});
// dummy about page
app.get('/about', (req, res) => {
	res.render('about');
});
