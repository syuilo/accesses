import * as express from 'express';
import * as io from 'socket.io';
import Options from '../options';

export default (options: Options) => {
	const app = express();
	app.disable('x-powered-by');
	app.locals.compileDebug = false;
	app.locals.cache = true;
	app.set('view engine', 'pug');
	app.set('views', __dirname);

	app.get('/', (req, res) => {
		res.render('view', options);
	});

	app.get('/style', (req, res) => {
		res.sendFile(__dirname + '/style.css');
	});

	app.get('/script', (req, res) => {
		res.sendFile(__dirname + '/script.js');
	});

	const server = app.listen(options.port);

	return io(server);
};
