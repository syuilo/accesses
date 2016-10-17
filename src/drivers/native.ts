import * as http from 'http';
import driver from '../driver';

export default driver(publish =>
	(server: http.Server) => {
		server.on('request', req => {
			publish(req);
		});
	}
);
