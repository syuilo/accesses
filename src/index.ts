/*!
 * accesses
 * Copyright (c) 2016-2017 syuilo
 * MIT Licensed
 */

import * as http from 'http';
import * as ws from 'ws';
import * as redis from 'redis';
import * as express from 'express';

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

	redis: {
		host: string;
		port: number;
		channel?: string;
	}
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

	private publisher: redis.RedisClient;
	private subscriber: redis.RedisClient;
	private channel: string;

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

		this.channel = opts.redis.channel || 'accesses';

		// Connect to Redis
		this.publisher = redis.createClient(
			opts.redis.port, opts.redis.host);
		this.subscriber = redis.createClient(
			opts.redis.port, opts.redis.host);

		this.subscriber.subscribe(this.channel);
		this.subscriber.on('message', this.onMessage);

		this.express = expressDriver(this);
	}

	/**
	 * イベントを受け取った時のハンドラ
	 * @param msg メッセージ
	 */
	@autobind
	private onMessage(channel, msg): void {
		this.broadcastToClientStream(msg);
	}

	/**
	 * クライアントにメッセージをブロードキャストします
	 * @param msg メッセージ
	 */
	@autobind
	private broadcastToClientStream(msg): void {
		this.wss.clients
			//.filter(client => client.readyState === ws.OPEN)
			.forEach(client => {
				if (client.readyState !== ws.OPEN) return;
				client.send(msg);
			});
	}

	/**
	 * イベントを公開します
	 * @param type イベント名
	 * @param data データ
	 */
	@autobind
	private emit(type: string, data: any): void {
		const msg = JSON.stringify({ type, data });
		this.publisher.publish(this.channel, msg);
	}

	/**
	 * リクエストを捕捉します
	 * @param req リクエスト
	 */
	@autobind
	public captureRequest(req: Request): void {
		this.emit('request', req);
	}

	/**
	 * レスポンスを捕捉します
	 * @param res レスポンス
	 */
	@autobind
	public captureResponse(res: Response): void {
		this.emit('response', res);
	}
}
