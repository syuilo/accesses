import * as cluster from 'cluster';
import * as event from './event';
import reportStatus from './report-status';

/**
 * Init master
 */
export default function() {
	// When receiving a message from workers
	cluster.on('message', (sender, message) => {
		// Ignore non accesses messages
		if (message.origin != 'syuilo/accesses') return;

		console.log('received message from worker');

		// Broadcast the message to all workers
		event.pub(message);
	});

	reportStatus();
}

