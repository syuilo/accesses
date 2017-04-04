import * as os from 'os';
import * as event from './event';

/**
 * Report status regularly
 */
export default function() {
	setInterval(() => {
		const info = getInfo();
		event.pub('info', info);
	}, 1000);
}

const getInfo = () => ({
	machine: os.hostname(),
	pid: process.pid,
	uptime: process.uptime()
});
