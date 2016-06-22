import * as os from 'os';
import * as cluster from 'cluster';
import seedColor from 'seed-color';
import Options from './options';
import Log from './log';
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
				case 'log':
					publish(msg.data);
					break;
				default:
					break;
			}
		});
	}

	function publish(log: Log): void {
		const color = seedColor(log.ip);

		io.emit('log', Object.assign({}, log, {
			color: {
				bg: color.toHex(),
				fg: color.getForegroundColor().toHex()
			}
		}));
	}
};
