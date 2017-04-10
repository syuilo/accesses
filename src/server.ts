/**
 * Server
 */

import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

import * as event from './event';
import reportStatus from './report-status';
import Context from './context';
import { SendReponse, Bypass } from './context';
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
	private wss: ws.Server;

	public intercepting: boolean = false;

	// Drivers
	public express: any;

	constructor(opts: Options) {
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

		event.internal.on('start-intercept', () => {
			this.intercepting = true;
		});

		event.internal.on('end-intercept', () => {
			this.intercepting = false;
		});

		if (cluster.isMaster) {
			reportStatus();
		}

		this.express = expressDriver(this);
	}

	@autobind
	private onStreamConnected(client) {
		client.on('message', message => {
			const msg = JSON.parse(message);
			switch (msg.action) {
				case 'intercept':
					if (this.intercepting) {
						this.unintercept();
					} else {
						this.intercept();
					}
					break;
				case 'response':
					this.interceptResponse(msg.status, msg.body, msg.id);
					break;
				case 'bypass':
					this.bypass(msg.id);
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

	/**
	 * リクエストを捕捉します
	 * @param req リクエスト
	 */
	@autobind
	public capture(req: any, response: SendReponse, bypass: Bypass): Context {
		const shouldIntercept = this.intercepting;
		const ctx = new Context(req, response, bypass, shouldIntercept);
		return ctx;
	}

	/**
	 * インターセプト開始
	 */
	@autobind
	public intercept(): void {
		event.internal.emit('start-intercept');
		event.stream.emit('start-intercept');
	}

	/**
	 * インターセプト終了
	 */
	@autobind
	public unintercept(): void {
		event.internal.emit('end-intercept');
		event.stream.emit('end-intercept');
	}

	@autobind
	public interceptResponse(status: number, body: any, id?: string) {
		event.internal.emit(id ? `intercept-response.${id}` : 'intercept-response', {
			status, body
		});
	}

	@autobind
	public bypass(id: string) {
		event.internal.emit(`intercept-bypass.${id}`);
	}
}
