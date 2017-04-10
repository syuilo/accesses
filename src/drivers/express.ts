/**
 * express driver
 */

import { Request, Response } from 'express';
import * as onFinished from 'on-finished';
const proxyaddr = require('proxy-addr');
import Core from '../';

export default (core: Core) => (req: Request, res: Response, next) => {
	const remoteaddr = proxyaddr(req, () => true);

	const ctx = core.capture({
		date: new Date(),
		url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
		remoteaddr: remoteaddr,
		httpVersion: req.httpVersion,
		method: req.method,
		headers: req.headers
	}, _res => {
		if (_res.body == null || _res.body == '') {
			res.sendStatus(_res.status);
		} else {
			res.status(_res.status).send(_res.body);
		}
	}, next);

	onFinished(res, () => {
		ctx.done(res.statusCode);
	});
};

