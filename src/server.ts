/**
 * Server
 */

import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

import * as event from './event';
import reportStatus from './report-status';
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

	/**
	 * Whether an IP addresses is hashed and
	 * displayed on the Web interface
	 */
	hashIp: boolean;
};

export type Request = {
	/**
	 * The ID of context between a request and a response
	 */
	id: string;

	remoteaddr: string;
	httpVersion: string;
	method: string;
	url: string;
	headers: any;
	date: Date;
};

export type Response = {
	/**
	 * The ID of context between a request and a response
	 */
	id: string;

	/**
	 * The status code of the response
	 */
	status: number;

	/**
	 * The time between request and response, in milliseconds
	 */
	time: number;
};

export default class Accesses {
	private wss: ws.Server;

	// Drivers
	public express: any;

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

		event.sub(this.broadcastToClientStream);

		if (cluster.isMaster) {
			reportStatus();
		}

		this.express = expressDriver(this);
	}

	/**
	 * クライアントにメッセージをブロードキャストします
	 * @param message メッセージ
	 */
	@autobind
	private broadcastToClientStream(message: object): void {
		this.wss.clients
			//.filter(client => client.readyState === ws.OPEN)
			.forEach(client => {
				if (client.readyState !== ws.OPEN) return;
				client.send(JSON.stringify(message));
			});
	}

	/**
	 * リクエストを捕捉します
	 * @param req リクエスト
	 */
	@autobind
	public captureRequest(req: Request): void {
		event.pub('request', req);
	}

	/**
	 * レスポンスを捕捉します
	 * @param res レスポンス
	 */
	@autobind
	public captureResponse(res: Response): void {
		event.pub('response', res);
	}
}
