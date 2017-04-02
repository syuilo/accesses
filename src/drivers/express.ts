import * as express from 'express';
import * as onFinished from 'on-finished';
import * as uuid from 'node-uuid';
const proxyaddr = require('proxy-addr');
import Accesses from '../';

export default (accesses: Accesses) => (req: express.Request, res: express.Response, next: any) => {
	const id = uuid.v4();
	const remoteaddr = proxyaddr(req, () => true);

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
		accesses.captureResponse({
			id: id,
			statusCode: res.statusCode
		});
	});

	next();
};

