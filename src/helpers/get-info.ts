import * as os from 'os';

export default () => ({
	machine: os.hostname(),
	pid: process.pid,
	uptime: process.uptime()
});
