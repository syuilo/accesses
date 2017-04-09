const express = require('express');
const Accesses = require('./built').default;

const accesses = new Accesses({
	port: 3000,
	appName: 'Strawberry Pasta',
	demo: true
});

const app = express();

// Register accesses middleware
app.use(accesses.express);

app.get('/', (req, res) => {
	res.send('yeah');
});

app.listen(8000);
