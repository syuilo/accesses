const express = require('express');
const accesses = require('../../built');

const log = accesses.serve({
	appName: 'My Web Service',
	port: 616
});

const app = express();

app.get('/', (req, res) => {
	res.send('yeah');

	log(req);
});

app.listen(80);
