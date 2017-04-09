/**
 * Web Script
 */

import './style.styl';
import './theme/visualstudio.styl';

import * as riot from 'riot';
import Connection from './scripts/stream';

require('./tags');

// ENTRY POINT
{
	riot.mixin('stream', {
		stream: new Connection()
	});

	window.onload = () => {
		riot.mount(document.body.appendChild(document.createElement('accesses-view')));
	};
}
