import publish from './publish';
import getInfo from './helpers/get-info';

/**
 * Report status regularly
 */
export default function() {
	setInterval(() => {
		const info = getInfo();
		publish({
			type: 'info',
			data: info
		});
	}, 1000);
}
