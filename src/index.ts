/*!
 * accesses
 * Copyright (c) 2016-2017 syuilo
 * MIT Licensed
 */

import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

// Drivers
import expressDriver from './drivers/express';

export type Options = {
	appName: string;
	port: number;
	hashIp: boolean;
};

export type Request = {
	id: string;
	remoteaddr: string;
	httpVersion: string;
	method: string;
	url: string;
	headers: any;
	date: Date;
};

export type Response = {
	id: string;
	statusCode: number;
};

export default class Accesses {
	wss: ws.Server;

	// Drivers
	express: any;

	constructor(opts: Options) {
		const app = express();
		app.disable('x-powered-by');
		app.set('view engine', 'pug')

		app.get('*', (req, res) => {
			res.render(__dirname + '/web/view.pug', opts);
		});

		const server = http.createServer(app);
		server.listen(opts.port);

		this.wss = new ws.Server({
			server: server
		});

		this.express = expressDriver(this);
	}

	private emit(type: string, data: any): void {
		// Broadcast
		this.wss.clients.forEach(client => {
			if (client.readyState === ws.OPEN) {
				client.send(JSON.stringify({ type, data }));
			}
		});
	}

	public captureRequest(req: Request): void {
		this.emit('request', req);
	}

	public captureResponse(res: Response): void {
		this.emit('response', res);
	}
}
