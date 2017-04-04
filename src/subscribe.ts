import * as cluster from 'cluster';

/**
 * Subscribe event
 * @param handler
 */
export default function(handler) {
	process.on('message', message => {
		// Ignore non accesses messages
		if (message.origin != 'syuilo/accesses') return;
		handler(message);
	});
	process.on('syuilo/accesses', handler);
}
