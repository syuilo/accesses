import * as process from 'process';
import * as express from 'express';
import * as onFinished from 'on-finished';
import * as uuid from 'node-uuid';
const proxyaddr = require('proxy-addr');
import Accesses from '../';

export default (accesses: Accesses) => (req: express.Request, res: express.Response, next: any) => {
	const id = uuid.v4();
	const remoteaddr = proxyaddr(req, () => true);

	const startAt = process.hrtime();

	accesses.captureRequest({
		id: id,
		date: new Date(),
		url: `${req.protocol}://${req.host}${req.originalUrl}`,
		remoteaddr: remoteaddr,
		httpVersion: req.httpVersion,
		method: req.method,
		headers: req.headers
	});

	onFinished(res, () => {
		const endAt = process.hrtime();

		// calculate diff
		const ms = (endAt[0] - startAt[0]) * 1e3 + (endAt[1] - startAt[1]) * 1e-6;

		accesses.captureResponse({
			id: id,
			status: res.statusCode,
			time: ms
		});
	});

	next();
};

