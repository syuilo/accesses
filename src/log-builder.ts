import seedColor from 'seed-color';
import AccessWithWorker from './access-with-worker';
import Log from './log';

export default (access: AccessWithWorker): Log => {
	const color = seedColor(access.ip);

	return Object.assign({}, access, {
		color: {
			bg: color.toHex(),
			fg: color.contrast().toHex()
		}
	});
};
