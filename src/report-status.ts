import * as os from 'os';
const osUtils = require('os-utils');
import * as event from './event';

/**
 * Report status regularly
 */
export default function() {
	setInterval(() => {
		osUtils.cpuUsage(cpuUsage => {
			event.pub('status', {
				machine: os.hostname(),
				pid: process.pid,
				uptime: process.uptime(),
				cpuUsage: cpuUsage,
				totalmem: os.totalmem(),
				freemem: os.freemem()
			});
		});
	}, 1000);
}
