/**
 * event system
 */

import * as cluster from 'cluster';

/**
 * イベントの識別に使われるID
 */
const origin = 'syuilo/accesses';

/**
 * Init event system
 * この関数は必ずmasterプロセスで呼び出します。
 * クラスタ上で動いてない場合、この関数の呼出は必要ありません。
 */
export function init(): void {
	if (cluster.isWorker) {
		throw 'Do not call this function in a worker process.';
	}

	// When receiving a message from workers
	cluster.on('message', (_, message) => broadcast(message));
	// When receiving a message from the master
	process.on('message', broadcast);

	function broadcast(message) {
		// Ignore non accesses messages
		if (message.origin != origin) return;

		// Broadcast the message to all workers
		for (const id in cluster.workers) {
			const worker = cluster.workers[id];
			worker.send(message);
		}
	}
}

/**
 * Publish event
 * @param type Event name
 * @param data Event data
 */
export function pub(type, data): void {
	const message = { type, data, origin };

	if (cluster.isMaster) {
		process.emit('message', message);
	} else {
		process.send(message);
	}
}

/**
 * Subscribe event
 * @param handler Event handler
 */
export function sub(handler): void {
	process.on('message', message => {
		// Ignore non accesses messages
		if (message.origin != origin) return;
		delete message.origin;
		handler(message);
	});
}
