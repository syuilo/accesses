import * as os from 'os';

export default () => {
	return {
		machine: os.hostname(),
		pid: process.pid,
		uptime: process.uptime()
	};
};
