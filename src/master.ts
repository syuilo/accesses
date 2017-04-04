import * as cluster from 'cluster';
import { id } from './const';

/**
 * Init master
 */
export default function() {
	cluster.on('message', (sender, message) => {
		// Ignore non accesses messages
		if (message.substr(0, id.length) != id) return;

		// Broadcast the message to all workers
		for (const id in cluster.workers) {
			const worker = cluster.workers[id];
			worker.send(message);
		}
	});
}
