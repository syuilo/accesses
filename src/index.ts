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

	/**
	 * クライアントにイベントを送信します
	 * @param type イベント名
	 * @param data データ
	 */
	private emit(type: string, data: any): void {
		// Broadcast
		this.wss.clients
			.filter(client => client.readyState === ws.OPEN)
			.forEach(client => {
				client.send(JSON.stringify({ type, data }));
			});
	}

	/**
	 * リクエストを捕捉します
	 * @param req リクエスト
	 */
	public captureRequest(req: Request): void {
		this.emit('request', req);
	}

	/**
	 * レスポンスを捕捉します
	 * @param res レスポンス
	 */
	public captureResponse(res: Response): void {
		this.emit('response', res);
	}
}
