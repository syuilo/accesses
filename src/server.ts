/**
 * Server
 */

import { EventEmitter } from 'events';
import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';
import * as uuid from 'uuid';

import event from './event';
import reportStatus from './report-status';
import autobind from './helpers/autobind';
import demo from './demo';

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

	demo?: boolean;
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
					case 'response':
						this.interceptResponse(msg.res, msg.id);
						break;
					case 'bypass':
						this.bypass(msg.id);
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

		if (opts.demo) {
			demo(this);
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
	public capture(req: any, response: Function, bypass: Function): Context {
		const ctx = new Context(response, bypass);
		const id = ctx.id;

		ctx.once('done', res => {
			event.emit('response', res);

			this.event.removeListener('intercept-response', ctx.response);
			this.event.removeListener(`intercept-response.${id}`, ctx.response);
			this.event.removeListener('intercept-bypass', ctx.bypass);
			this.event.removeListener(`intercept-bypass.${id}`, ctx.bypass);
			this.event.removeListener('end-intercept', ctx.bypass);
		});

		if (this.intercepting) {
			req.intercepted = true;

			this.event.once('intercept-response', ctx.response);
			this.event.once(`intercept-response.${id}`, ctx.response);
			this.event.once('intercept-bypass', ctx.bypass);
			this.event.once(`intercept-bypass.${id}`, ctx.bypass);
			this.event.once('end-intercept', ctx.bypass);
		} else {
			bypass();
		}

		event.emit('request', req);

		return ctx;
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

	@autobind
	public bypass(id: string) {
		event.emit(`intercept-bypass.${id}`);
	}
}

export class Context extends EventEmitter {
	public id: string;
	public startAt: [number, number];

	public response: Function;
	public bypass: Function;

	constructor(response: Function, bypass: Function) {
		super();

		this.id = uuid.v4();
		this.startAt = process.hrtime();

		this.response = response;
		this.bypass = bypass;
	}

	public done(status: number): Response {
		const start = this.startAt;
		const end = process.hrtime();

		// calculate diff
		const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;

		const res: Response = {
			id: this.id,
			status: status,
			time: ms
		};

		this.emit('done', res);

		return res;
	}
}
