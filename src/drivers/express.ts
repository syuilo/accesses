/// <reference path="../../typings/express/express.d.ts"/>
import express = require('express');

import * as cluster from 'cluster';
import driver from '../driver';

export default driver(publish =>
	(req: express.Request, res: express.Response, next: any) => {
		next();

		publish({
			ip: req.ip,
			method: req.method,
			host: req.hostname,
			path: req.path,
			ua: req.headers['user-agent'],
			date: new Date(Date.now()),
			worker: cluster.isMaster ? 'master' : cluster.worker.id
		});
	}
);
