import * as cluster from 'cluster';

const origin = 'syuilo/accesses';

/**
 * Init event system
 * この関数は必ずmasterプロセスで呼び出します。
 * クラスタ上で動いてない場合、この関数の呼出は必要ありません。
 */
export function init() {
	// When receiving a message from workers
	cluster.on('message', (sender, message) => {
		// Ignore non accesses messages
		if (message.origin != origin) return;

		// Broadcast the message to all workers
		for (const id in cluster.workers) {
			const worker = cluster.workers[id];
			worker.send(Object.assign(message, { origin }));
		}
	});
}

/**
 * Publish event
 */
export function pub(x, y?) {
	const message = arguments.length == 1 ? x : {
		type: x,
		data: y
	};

	if (cluster.isMaster) {
		// クラスタ上で動いている場合
		if (Object.keys(cluster.workers).length > 0) {
			// Each all workers
			for (const id in cluster.workers) {
				const worker = cluster.workers[id];
				worker.send(Object.assign(message, { origin }));
			}
		} else {
			process.emit(origin, message);
		}
	} else {
		process.send(Object.assign(message, { origin }));
	}
}

/**
 * Subscribe event
 * @param handler
 */
export function sub(handler) {
	process.on('message', message => {
		// Ignore non accesses messages
		if (message.origin != origin) return;
		handler(message);
	});
	process.on(origin, handler);
}
