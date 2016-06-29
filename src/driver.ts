import * as http from 'http';
import Options from './options';
import serve from './serve';

export default (handler: (publish: (req: http.IncomingMessage) => void) => void) => (options?: Options) => {
	const publish = serve(options);

	return handler(publish);
};
