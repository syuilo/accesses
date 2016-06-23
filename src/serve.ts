import * as cluster from 'cluster';
import Options from './options';
import AccessWithWorker from './access-with-worker';
import build from './log-builder';
import getInfo from './get-info';
import server from './web/index';

export default (options: Options) => {
	if (cluster.isWorker) {
		throw 'accesses.serve() can be call from master process only.';
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

	return publish;

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

	function publish(access: AccessWithWorker): void {
		// Broadcast
		io.emit('log', build(access));
	}
};
