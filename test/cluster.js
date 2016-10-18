const cluster = require('cluster');

const express = require('express');
const accesses = require('../built');

// Master
if (cluster.isMaster) {
	// Count the machine's CPUs
	const cpuCount = require('os').cpus().length;

	// Create a worker for each CPU
	for (let i = 0; i < cpuCount; i++) {
		cluster.fork();
	}

	// Setup accesses from master proccess
	accesses.serve({
		appName: 'My Web Service',
		port: 8001
	});
}
// Workers
else {
	const app = express();

	// Register accesses middleware
	app.use(accesses.express());

	app.get('/', (req, res) => {
		res.send('yeah');
	});

	app.listen(8000);
}
