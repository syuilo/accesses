/**
 * express driver
 */

import * as process from 'process';
import * as express from 'express';
import * as onFinished from 'on-finished';
import * as uuid from 'uuid';
const proxyaddr = require('proxy-addr');
import Accesses from '../';

export default (accesses: Accesses) => (req: express.Request, res: express.Response, next: any) => {
	const id = uuid.v4();
	const remoteaddr = proxyaddr(req, () => true);

	const startAt = process.hrtime();

	accesses.captureRequest({
		id: id,
		date: new Date(),
		url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
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

	if (accesses.intercepting) {
		accesses.event.once('intercept-response', _res => {
			res.send(_res);
		});

		accesses.event.once('intercept-response.' + id, _res => {
			if (_res.body == null || _res.body == '') {
				res.sendStatus(_res.status);
			} else {
				res.status(_res.status).send(_res.body);
			}
		});

		accesses.event.once('intercept-bypass.' + id, () => {
			next();
		});

		accesses.once('end-intercept', () => {
			next();
		});
	} else {
		next();
	}
};

