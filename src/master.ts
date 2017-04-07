import * as cluster from 'cluster';
import event from './event';
import reportStatus from './report-status';

/**
 * Init master
 */
export default function() {
	event.mount();

	reportStatus();
}

