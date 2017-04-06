import * as os from 'os';
const osUtils = require('os-utils');
import * as diskusage from 'diskusage';
import * as event from './event';

/**
 * Report status regularly
 */
export default function() {
	setInterval(() => {
		osUtils.cpuUsage(cpuUsage => {
			const disk = diskusage.checkSync(os.platform() == 'win32' ? 'c:' : '/');
			event.pub('status', {
				node: {
					release: (process as any).release.name,
					lts: (process as any).release.lts,
					version: process.version
				},
				machine: os.hostname(),
				pid: process.pid,
				uptime: process.uptime(),
				cpuUsage: cpuUsage,
				mem: {
					total: os.totalmem(),
					free: os.freemem()
				},
				disk
			});
		});
	}, 1000);
}
