import * as cluster from 'cluster';
import Options from './options';
import Access from './access';
import serve from './serve';

export default (handler: (log: any) => any): any => (options?: Options) => {
	if (cluster.isMaster && !options) {
		throw 'options is required.';
	}

	const publish = cluster.isMaster ? serve(options) : (access: Access) => {
		process.send({
			type: 'access',
			data: access
		});
	};

	return handler(publish);
};
