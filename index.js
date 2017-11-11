const express = require('express');
const app = express();
const PORT = 8080;

// own basic middleware with access to
// req, res and the next middleware of 
// the stack that should be called.
app.use((req, res, next) => {
	lout("middleware called");
	
	// manipulate req to demonstrate that we can
	// change the req.
	req.name = "kaziRabi";
	
	// must call next(), otherwise this middleware
	// will not release the request, ultimately
	// resulting in no response at all.
	next();
});

function lout(obj){
	console.log(obj);
}

app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

app.get('/', (req, res) => {
	// print the attribute added by our middleware
	lout(req.name);
	res.send("hello world!");
});