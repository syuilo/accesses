import * as cluster from 'cluster';
import * as http from 'http';
import * as crypto from 'crypto';
import Options from './options';
import Access from './access';
import build from './log-builder';
import getInfo from './get-info';
import server from './web/index';

export default (options?: Options) => {
	if (cluster.isMaster) {
		if (!options) {
			throw 'options is required.';
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

		return (req: http.IncomingMessage) => {
			publish(build(Object.assign({}, req, {
				worker: 'master'
			})));
		};

		function attach(worker: cluster.Worker): void {
			worker.on('message', onMessage);
		}

		function onMessage(message: any): void {
			switch (message.type) {
				case 'access':
					publish(message.data);
					break;

				default:
					// Ignore
					break;
			}
		}

		function publish(access: Access): void {
			// Hash remote addr if hashIp option is true
			if (options.hashIp) {
				const sha512 = crypto.createHash('sha256');
				sha512.update(access.remoteaddr);
				const hash = sha512.digest('hex');

				access.remoteaddr = hash;
			}

			// Broadcast
			io.emit('log', access);
		}
	} else {
		return (req: http.IncomingMessage) => {
			process.send({
				type: 'access',
				data: build(Object.assign({}, req, {
					worker: cluster.worker.id
				}))
			});
		};
	}
};
