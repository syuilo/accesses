/**
 * Server
 */

import { EventEmitter } from 'events';
import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';
import event from './event';

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
};

export type Request = {
	/**
	 * The ID of context between a request and a response
	 */
	id: string;

	/**
	 * Remote address
	 */
	remoteaddr: string;

	/**
	 * HTTP version
	 */
	httpVersion: string;

	/**
	 * HTTP method
	 */
	method: string;

	/**
	 * Requested URL
	 */
	url: string;

	/**
	 * Request headers
	 */
	headers: any;

	/**
	 * Requedted at
	 */
	date: Date;

	intercepted?: boolean;
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

export default class Server extends EventEmitter {
	private wss: ws.Server;

	public intercepting: boolean = false;

	public event: EventEmitter;

	// Drivers
	public express: any;

	constructor(opts: Options) {
		super();

		this.event = event;

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

		this.wss.on('connection', client => {
			client.on('message', message => {
				const msg = JSON.parse(message);
				console.log(msg);
				switch (msg.action) {
					case 'intercept':
						if (this.intercepting) {
							this.unintercept();
						} else {
							this.intercept();
						}
						break;
					case 'intercept-response':
						this.interceptResponse(msg.res, msg.id);
						break;
				}
			});
		});

		event.on('*', this.broadcast);

		event.on('start-intercept', () => {
			this.intercepting = true;
			this.emit('start-intercept');
		});

		event.on('end-intercept', () => {
			this.intercepting = false;
			this.emit('end-intercept');
		});

		if (cluster.isMaster) {
			reportStatus();
		}

		this.express = expressDriver(this);
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

	/**
	 * リクエストを捕捉します
	 * @param req リクエスト
	 */
	@autobind
	public captureRequest(req: Request): void {
		req.intercepted = this.intercepting;
		event.emit('request', req);
	}

	/**
	 * レスポンスを捕捉します
	 * @param res レスポンス
	 */
	@autobind
	public captureResponse(res: Response): void {
		event.emit('response', res);
	}

	/**
	 * インターセプト開始
	 */
	@autobind
	public intercept(): void {
		event.emit('start-intercept');
	}

	/**
	 * インターセプト終了
	 */
	@autobind
	public unintercept(): void {
		event.emit('end-intercept');
	}

	@autobind
	public interceptResponse(res: string, id?: string) {
		event.emit(id ? `intercept-response.${id}` : 'intercept-response', res);
	}
}
