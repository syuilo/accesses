import * as os from 'os';
import * as cluster from 'cluster';
import Options from './options';
import Access from './access';
import build from './log-builder';
import server from './web/index';

const getInfo = () => {
	return {
		machine: os.hostname(),
		pid: process.pid,
		uptime: process.uptime()
	};
};

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
		worker.on('message', (msg: any) => {
			switch (msg.type) {
				case 'access':
					publish(msg.data);
					break;
				default:
					break;
			}
		});
	}

	function publish(access: Access): void {
		io.emit('log', build(access));
	}
};
