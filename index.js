const express = require('express');
const app = express();
const PORT = 8080;

function lout(obj){
	console.log(obj);
}

app.listen(PORT, () => lout(`Server Started On Port: ${PORT}`));

app.get('/', (req, res) => {
	res.send("hello world!");
});