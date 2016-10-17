import http from 'http';
import driver from '../driver';

export default driver(publish =>
	() => {
		publish({});
	}
);
