import * as cluster from 'cluster';

/**
 * Publish event
 */
export default function(x, y?) {
	const message = arguments.length == 1 ? x : {
		type: x,
		data: y
	};

	if (cluster.isMaster) {
		if (Object.keys(cluster.workers).length > 0) {
			// Each all workers
			for (const id in cluster.workers) {
				const worker = cluster.workers[id];
				worker.send(Object.assign(message, {
					origin: 'syuilo/accesses'
				}));
			}
		} else {
			process.emit('syuilo/accesses', message);
		}
	} else {
		process.send(Object.assign(message, {
			origin: 'syuilo/accesses'
		}));
	}
}
