import seedColor from 'seed-color';
import Access from './access';
import Log from './log';

export default (access: Access): Log => {
	const color = seedColor(access.ip);

	return Object.assign({}, access, {
		color: {
			bg: color.toHex(),
			fg: color.contrast().toHex()
		}
	});
};
