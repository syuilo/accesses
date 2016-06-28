/// <reference path="../../typings/express/express.d.ts"/>
import express = require('express');
import driver from '../driver';

export default driver(publish =>
	(req: express.Request, res: express.Response, next: any) => {
		next();

		publish(req);
	}
);
