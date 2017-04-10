/**
 * Server
 */

import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

import * as event from './event';
import reportStatus from './report-status';
import Core from './core';
import autobind from './helpers/autobind';

// Drivers
import expressDriver from './drivers/express';

export type Options = {
	/**
	 * Your application name
	 */
	appName: string;

	/**
	 * The port number you want to provide the Web interface
	 */
	port: number;
};

export default class Server {
	private core: Core;
	private wss: ws.Server;

	// Drivers
	public express: any;

	constructor(opts: Options) {
		this.core = new Core();

		{ // Set up server
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

			this.wss.on('connection', this.onStreamConnected);
		}

		event.stream.on('*', this.broadcast);

		if (cluster.isMaster) {
			reportStatus();
		}

		this.express = expressDriver(this.core);
	}

	@autobind
	private onStreamConnected(client) {
		client.on('message', message => {
			const msg = JSON.parse(message);
			switch (msg.action) {
				case 'intercept':
					if (this.core.intercepting) {
						this.core.unintercept();
					} else {
						this.core.intercept();
					}
					break;
				case 'response':
					this.core.interceptResponse(msg.status, msg.body, msg.id);
					break;
				case 'bypass':
					this.core.bypass(msg.id);
					break;
			}
		});
	}

	/**
	 * クライアントにメッセージをブロードキャストします
	 * @param type    イベント
	 * @param message メッセージ
	 */
	@autobind
	private broadcast(type: string, data: object): void {
		this.wss.clients
			//.filter(client => client.readyState === ws.OPEN)
			.forEach(client => {
				if (client.readyState !== ws.OPEN) return;
				client.send(JSON.stringify({ type, data }));
			});
	}
}
