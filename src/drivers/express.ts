/**
 * express driver
 */

import { Request, Response } from 'express';
import * as onFinished from 'on-finished';
const proxyaddr = require('proxy-addr');
import Core from '../core';

export default (core: Core) => (req: Request, res: Response, next) => {
	const remoteaddr = proxyaddr(req, () => true);

	const ctx = core.capture({
		date: new Date(),
		url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
		remoteaddr: remoteaddr,
		httpVersion: req.httpVersion,
		method: req.method,
		headers: req.headers
	}, (status, body) => {
		if (body == null || body == '') {
			res.sendStatus(status);
		} else {
			res.status(status).send(body);
		}
	}, next);

	onFinished(res, () => {
		ctx.done(res.statusCode);
	});
};

