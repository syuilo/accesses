//////////////////////////////////////////////////
// MISSKEY-WEB-LOGGER
//////////////////////////////////////////////////

import * as os from 'os';
import * as cluster from 'cluster';
import seedColor from 'seed-color';
import Options from './options';
import server from './web/index';

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 syuilo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const getInfo = () => {
	return {
		machine: os.hostname(),
		pid: process.pid,
		uptime: process.uptime()
	};
};

const serve = (options: Options) => {
	if (cluster.isWorker) {
		return null;
	}

	for (let id in cluster.workers) {
		attach(cluster.workers[id]);
	}

	// Listen new workers
	cluster.on('fork', attach);

	const io = server(options);

	io.on('connection', socket => {
		socket.emit('info', getInfo());
	});

	setInterval(() => {
		io.emit('info', getInfo());
	}, 1000);

	return log;

	function attach(worker: cluster.Worker): void {
		worker.on('message', (msg: any) => {
			log(msg);
		});
	}

	function log(data: any): void {
		io.emit('log', data);
	}
};

export = {
	serve,

	express: (options: Options): any => {
		const publish = serve(options);

		return (req: any, res: any, next: any) => {
			next();

			const color = seedColor(req.ip);

			const log = {
				ip: req.ip,
				method: req.method,
				host: req.hostname,
				path: req.path,
				ua: req.headers['user-agent'],
				date: Date.now(),
				worker: cluster.isMaster ? 'master' : cluster.worker.id,
				color: {
					bg: color.toHex(),
					fg: color.getForegroundColor().toHex()
				}
			};

			if (cluster.isMaster) {
				publish(log);
			} else {
				process.send(log);
			}
		};
	}
};
