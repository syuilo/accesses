import * as cluster from 'cluster';
import * as event from './event';
import reportStatus from './report-status';

/**
 * Init master
 */
export default function() {
	event.internal.mount();
	event.stream.mount();

	reportStatus();
}

