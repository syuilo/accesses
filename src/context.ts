import * as uuid from 'uuid';
import { Request, Response } from './core';
import { internal as event, stream } from './event';
import autobind from './helpers/autobind';

export type SendReponse = (status: number, body: any) => any;
export type Bypass = () => any;

export default class Context {
	public id: string;
	public startAt: [number, number];

	private response: SendReponse;
	private bypass: Function;

	private intercept: boolean;

	constructor(req: any, response: SendReponse, bypass: Bypass, shouldIntercept: boolean) {
		this.id = uuid.v4();
		this.startAt = process.hrtime();

		this.response = response;
		this.bypass = bypass;

		this.intercept = shouldIntercept;

		if (this.intercept) {
			event.once('intercept-response', this._response);
			event.once(`intercept-response.${this.id}`, this._response);
			event.once('intercept-bypass', this.bypass);
			event.once(`intercept-bypass.${this.id}`, this.bypass);
			event.once('end-intercept', this.bypass);
		} else {
			bypass();
		}

		stream.emit('request', Object.assign(req, {
			id: this.id,
			intercepted: shouldIntercept
		}));
	}

	@autobind
	public done(status: number): void {
		const start = this.startAt;
		const end = process.hrtime();

		// calculate diff
		const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;

		const res: Response = {
			id: this.id,
			status: status,
			time: ms
		};

		stream.emit('response', res);

		if (this.intercept) {
			event.removeListener('intercept-response', this._response);
			event.removeListener(`intercept-response.${this.id}`, this._response);
			event.removeListener('intercept-bypass', this.bypass);
			event.removeListener(`intercept-bypass.${this.id}`, this.bypass);
			event.removeListener('end-intercept', this.bypass);
		}
	}

	@autobind
	private _response(res) {
		this.response(res.status, res.body);
	}
}
