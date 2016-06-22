/// <reference path="../../typings/express/express.d.ts"/>
import express = require('express');

import * as cluster from 'cluster';
import Options from '../options';
import serve from '../serve';

export default (options: Options): any => {
	const publish = serve(options);

	return (req: express.Request, res: express.Response, next: any) => {
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
	};
};
