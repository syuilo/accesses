import * as cluster from 'cluster';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

import autobind from './helpers/autobind';
import getInfo from './helpers/get-info';
import { id } from './const';

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

	private infoClock: NodeJS.Timer;

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

		if (cluster.isWorker) {
			process.on('message', this.onMessage);
		}

		this.infoClock = setInterval(this.emitInfo, 1000);

		this.express = expressDriver(this);
	}

	/**
	 * イベントを受け取った時のハンドラ
	 * @param message メッセージ
	 */
	@autobind
	private onMessage(message): void {
		// Ignore non accesses messages
		if (message.substr(0, id.length) != id) return;

		message = message.substr(id.length);
		this.broadcastToClientStream(message);
	}

	/**
	 * クライアントにメッセージをブロードキャストします
	 * @param msg メッセージ
	 */
	@autobind
	private broadcastToClientStream(msg: string): void {
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
		const msg = id + JSON.stringify({ type, data });
		if (cluster.isMaster) {
			this.onMessage(msg);
		} else {
			process.send(msg);
		}
	}

	@autobind
	private emitInfo(): void {
		this.broadcastToClientStream(JSON.stringify({
			type: 'info',
			data: getInfo()
		}));
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
