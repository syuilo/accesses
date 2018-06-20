![accesses](./accesses.png)
================================================================

[![][npm-badge]][npm-link]
[![][travis-badge]][travis-link]
[![][david-badge]][david-link]
[![][david-dev-badge]][david-dev-link]
[![][mit-badge]][mit]

[![NPM](https://nodei.co/npm/accesses.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/accesses/) [![Greenkeeper badge](https://badges.greenkeeper.io/syuilo/accesses.svg)](https://greenkeeper.io/)

A graphical access logger for [Node](https://github.com/nodejs/node).

![](https://file.himasaku.net/58eac07920b67b2671d4f6ef/anime.gif)

Features
----------------------------------------------------------------
* Frameworks support
  * [express](https://github.com/expressjs/express)
  * [koa](https://github.com/koajs/koa) (todo)
  * and more (todo)
* Cluster support
* Databases support (todo)

Install
----------------------------------------------------------------
``` shell
$ npm install accesses --save
```

Usage
----------------------------------------------------------------
### Init accesses
``` javascript
import Accesses from 'accesses';

// Set up
const accesses = new Accesses({
	appName: 'My Web Service',
	port: 616
});
```

### Register accesses to a framework as a middleware
#### [express](https://github.com/expressjs/express)
``` javascript
import * as express from 'express';

const app = express();

// Register as a middleware
app.use(accesses.express);

app.get('/', (req, res) => {
	res.send('yeah');
});

app.listen(80);
```

### If you use the cluster...
You must be call `master` function at master process. e.g.:
``` javascript
import * as cluster from 'cluster';
import { master } from 'accesses';

// Master
if (cluster.isMaster) {
	// your master code

	// Call master function
	master();
}
// Workers
else {
	// your worker code
}

```

### That is it.
Now, we can monitor accesses on localhost:616

Intercept requests
----------------------------------------------------------------
accesses can intercept to request. So, you can hold, drop and bypass
a request and send a custom resoponse.

![](https://file.himasaku.net/58eac09b20b67b2671d4f6f0/Animation.gif)

When turn on intercepting mode, all requests will hold.

Reference
----------------------------------------------------------------
### options
| Property     | Type     | Description                      |
| ------------ | -------- | -------------------------------- |
| **appName**  | *string* | Your app name                    |
| **port**     | *number* | Port number that you want listen |
| **store**    | *Store*  | todo |

Contribution
----------------------------------------------------------------
Issue reports, feature requests and pull requests are welcome!

License
----------------------------------------------------------------
[MIT](LICENSE)

[npm-link]:        https://www.npmjs.com/package/accesses
[npm-badge]:       https://img.shields.io/npm/v/accesses.svg?style=flat-square
[mit]:             http://opensource.org/licenses/MIT
[mit-badge]:       https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:     https://travis-ci.org/syuilo/accesses
[travis-badge]:    http://img.shields.io/travis/syuilo/accesses.svg?style=flat-square
[david-link]:      https://david-dm.org/syuilo/accesses#info=dependencies&view=table
[david-badge]:     https://img.shields.io/david/syuilo/accesses.svg?style=flat-square
[david-dev-link]:  https://david-dm.org/syuilo/accesses#info=devDependencies&view=table
[david-dev-badge]: https://img.shields.io/david/dev/syuilo/accesses.svg?style=flat-square
