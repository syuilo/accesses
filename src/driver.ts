import * as cluster from 'cluster';
import Options from './options';
import Log from './log';
import serve from './serve';

export default (handler: (log: any) => any): any => (options?: Options) => {
	if (cluster.isMaster && !options) {
		throw 'options is required.';
	}

	const publish = cluster.isMaster ? serve(options) : (log: Log) => {
		process.send({
			type: 'log',
			data: log
		});
	};

	return handler(publish);
};
