/// <reference path="../../typings/express/express.d.ts"/>
import express = require('express');
import * as url from 'url';

import driver from '../driver';

export default driver(publish =>
	(req: express.Request, res: express.Response, next: any) => {
		next();

		publish({
			ip: req.ip,
			protocol: req.protocol,
			method: req.method,
			host: req.hostname,
			path: req.path,
			query: url.parse(req.url).query,
			headers: req.headers,
			date: new Date(Date.now())
		});
	}
);
