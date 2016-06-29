import * as http from 'http';
import * as url from 'url';
const proxyaddr = require('proxy-addr');
import seedColor from 'seed-color';
import Log from './log';

export default (req: http.IncomingMessage & { worker: string }): Log => {
	const urlctx = url.parse(req.url);
	const remoteaddr = proxyaddr(req, () => true);
	const color = seedColor(remoteaddr);

	return {
		date: new Date(Date.now()),
		remoteaddr: remoteaddr,
		protocol: (<any>req.socket).encrypted ? 'https' : 'http',
		httpVersion: req.httpVersion,
		method: req.method,
		headers: req.headers,
		path: urlctx.pathname,
		query: urlctx.query,
		color: {
			bg: color.toHex(),
			fg: color.contrast().toHex()
		},
		worker: req.worker
	};
};
