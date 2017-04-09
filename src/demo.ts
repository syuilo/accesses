/**
 * demonstration
 */

import * as uuid from 'uuid';
import Server from './server';

export default (server: Server) => {
	createFakeSession();

	function createFakeSession() {
		const id = uuid.v4();

		const startAt = process.hrtime();

		server.captureRequest({
			id: id,
			date: new Date(),
			url: choice(
				'http://example.com',
				'http://example.com',
				'http://example.com',
				'http://files.example.com',
				'http://himasaku.net',
				'http://api.himasaku.net',
				'http://syuilo.com'
			) + '/' +
			randomStr() + '/' + [choice('', randomStr()), choice('', randomStr()), choice('', randomStr())].filter(x => x != '').join('/') +
			choice('', '.png', '.jpg', '.html', '.css', '.js') +
			choice('', '', '', '?my-query=xxx', '?a=b&c=d&e=f', '?xxxxxxx'),
			remoteaddr: '127.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256),
			httpVersion: '',
			method: choice('GET', 'GET', 'GET', 'GET', 'POST', 'POST', 'HEAD', 'OPIONS'),
			headers: {
				'user-agent': choice(
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
					'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
					'Mozilla/5.0 (Linux; Android 7.1.2; Nexus 5X Build/N2G47F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36',
					'Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0',
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
					'Mozilla/5.0 (iPad; CPU OS 10_3_2 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko)'
				)
			}
		});

		setTimeout(() => {
			const endAt = process.hrtime();

			// calculate diff
			const ms = (endAt[0] - startAt[0]) * 1e3 + (endAt[1] - startAt[1]) * 1e-6;

			server.captureResponse({
				id: id,
				status: choice(200, 200, 200, 201, 204, 304, 404, 500),
				time: ms
			});
		}, Math.random() * 2000);

		setTimeout(createFakeSession, Math.random() * 2000);
	}
};

function choice(...choices) {
	return choices[Math.floor(Math.random() * choices.length)];
};

function randomStr() {
	return choice(
		'strawberry',
		'pasta',
		'alice',
		'xxx',
		'yyy',
		'zzz'
	);
};
