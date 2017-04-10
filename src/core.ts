import * as event from './event';
import Context from './context';
import { SendReponse, Bypass } from './context';
import autobind from './helpers/autobind';

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

export default class Core {
	public intercepting: boolean = false;

	constructor() {
		event.internal.on('start-intercept', () => {
			this.intercepting = true;
		});

		event.internal.on('end-intercept', () => {
			this.intercepting = false;
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
