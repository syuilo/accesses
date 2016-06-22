const express = require('express');
const accesses = require('../built');

const app = express();

// Register accesses middleware
app.use(accesses.express({
	appName: 'My Web Service',
	port: 616
}));

app.get('/', (req, res) => {
	res.send('yeah');
});

app.listen(80);
