<accesses-view>
	<header>
		<div>
			<div class="left">
				<p class="app">{ app }</p>
				<accesses-node />
				<p class="machine">MACHINE: { status.machine }</p>
				<p class="pid">PID: { status.pid }</p>
				<p class="uptime">UP: { status.uptime }s</p>
				<p class="now">{ now }</p>
			</div>
			<div class="right">
				<a class="export" href="#" onclick={ export }><i class="fa fa-download"></i>Export</a>
				<button class="clear" onclick={ clear }><i class="fa fa-times"></i>Clear</button>
				<button class="follow { enable: follow }" onclick={ toggleFollow }><i class="fa fa-sort-amount-desc"></i>Follow</button>
				<button class="rec { enable: rec }" onclick={ toggleRec }><i class="fa fa-{ rec ? 'pause' : 'play' }"></i>REC</button>
			</div>
		</div>
		<div>
			<accesses-cpu />
			<accesses-mem />
			<accesses-disk />
		</div>
	</header>

	<table>
		<thead>
			<tr>
				<th class="date">Requested at</th>
				<th class="method">Method</th>
				<th class="host">Host</th>
				<th class="path">Path</th>
				<th class="ua">User-Agent</th>
				<th class="ip">Remote Addr</th>
				<th class="res">Response</th>
			</tr>
		</thead>
		<tbody>
			<tr each={ logs } tabindex="-1" id={ id }>
				<td class="date" title={ date }>{ date }</td>
				<td class="method { method.toLowerCase() }" title={ method }>{ method }</td>
				<td class="host" title={ _url.hostname }>{ _url.hostname }</td>
				<td class="path" title={ url }>
					<span class="path">{ _url.pathname }</span>
					<span class="query" if={ _url.search }>{ _url.search }</span>
					<span class="hash" if={ _url.hash }>{ _url.hash }</span>
				</td>
				<td class="ua" title={ headers['user-agent'] }>{ headers['user-agent'] || '' }</td>
				<td class="ip" title={ remoteaddr } style="color:{ fg } !important"><span style="background:{ bg }">{ remoteaddr }</span></td>
				<td class="res" title={ !res ? '(pending)' : res.status + ' (' + res.time.toFixed(3) + 'ms)' }>
					<span class="pending" if={ !res }>(pending)</span>
					<span class="status { res.kind }" if={ res }>{ res.status }</span>
					<span class="time" if={ res }>({ res.time.toFixed(0) }ms)</span>
				</td>
			</tr>
		</tbody>
	</table>

	<accesses-stream-indicator />

	<style>
		:scope
			display block

			> header
				display block
				position sticky
				z-index 10000
				top 0
				left 0
				font-size 0.8em
				background var(--header-background)

				> div:nth-child(1)

					> .left, > .right
						background inherit
						white-space nowrap

						> *
							display inline-block
							line-height 32px
							vertical-align top

					> .left
						position relative

					> .right
						position absolute
						top 0
						right 0

						button, a
							-webkit-appearance none
							-moz-appearance none
							appearance none
							user-select none
							cursor pointer
							padding 0 12px
							margin 0
							font-size 1em
							text-decoration none
							color var(--header-button-foreground)
							outline none
							border none
							border-left solid 1px var(--header-separator-color)
							border-radius 0
							box-shadow none
							background transparent
							transition all .3s ease

							*
								pointer-events none

							> i
								margin-right 4px

							&:hover
								color var(--header-button-hover-foreground)
								transition all 0.1s ease

							&:active
								transition all 0s ease

					p
						margin 0
						padding 0

					.app
						padding 0 12px
						font-weight bold
						color var(--header-title-foreground)
						border-right solid 1px var(--header-separator-color)

					accesses-node
						padding 0 12px
						color var(--header-machine-foreground)
						border-right solid 1px var(--header-separator-color)

					.machine
						padding 0 12px
						color var(--header-machine-foreground)
						border-right solid 1px var(--header-separator-color)

					.pid
						padding 0 12px
						color var(--header-pid-foreground)
						border-right solid 1px var(--header-separator-color)

					.uptime
						padding 0 12px
						min-width 12em
						color var(--header-uptime-caption-foreground)
						border-right solid 1px var(--header-separator-color)

					.now
						padding 0 12px
						color var(--header-now-foreground)
						border-right solid 1px var(--header-separator-color)

						&:before
							content "\f017"
							font-family FontAwesome
							margin-right 6px

					.follow
						color var(--header-follow-foreground)
						transition all 0.2s ease

						> i
							margin-right 4px

						&.enable
							color #c1e31c

							&:hover
								color lighten(#c1e31c, 30%)
								transition all 0.1s ease

							&:active
								color darken(#c1e31c, 20%)
								transition all 0s ease

					.rec
						color var(--header-rec-foreground)
						background #000
						transition all 0.2s ease

						&:hover
							background #111
							transition all 0.1s ease

						&:active
							background #222
							transition all 0s ease

						&.enable
							color #fff
							background #f00

							&:hover
								background #f22

							&:active
								background #e00

						> i
							margin-right 4px

				> div:nth-child(2)
					border-top solid 1px var(--header-separator-color)

					> *
						display inline-block
						padding 0 12px
						line-height 32px
						border-right solid 1px var(--header-separator-color)

			> table
				width 100%
				border-collapse collapse
				table-layout fixed

				.date
					width 9%

				.method
					width 4%

				.host
					width 11%

				.path
					width 22%

				.ua
					width 37%

				.ip
					width 10%

				.res
					width 7%

				> thead
					display block
					position sticky
					z-index 1
					top 65px
					left 0
					width 100%
					font-size 0.8em
					color var(--logs-header-foreground)
					background var(--logs-header-background)

					&.dragging > tr > th:not(.chosen)
						background transparent !important

					> tr
						display block
						position relative
						width 100%

						> th
							display inline-block
							position relative
							box-sizing border-box
							padding 6px 12px
							text-align left
							word-wrap break-word
							white-space nowrap
							text-overflow ellipsis
							outline none
							overflow hidden

							&:hover
								background var(--logs-header-column-hover-background)

							&.chosen
								background var(--logs-header-column-chosen-background)

				> tbody
					display block
					font-size 0.8em

					> tr
						display block
						position relative
						margin 0
						padding 0
						width 100%
						cursor default

						&:nth-child(odd)
							background var(--logs-body-log-odd-background)

							&:hover
								background var(--logs-body-log-odd-hover-background)

						&:nth-child(even)
							background var(--logs-body-log-even-background)

							&:hover
								background var(--logs-body-log-even-hover-background)

						&:focus
							background var(--logs-body-log-focus-background) !important
							outline none

							&, > *:not(.ip), > *:not(.ip) *
								color var(--logs-body-log-focus-foreground) !important

						> td
							display inline-block
							box-sizing border-box
							padding 6px 12px
							word-wrap break-word
							white-space nowrap
							text-overflow ellipsis
							overflow hidden

							&.date
								color var(--logs-body-log-column-date-foreground)

							&.method
								&.get
									color var(--logs-body-log-column-method-get-foreground)

								&.post
									color var(--logs-body-log-column-method-post-foreground)

							&.host
								color var(--logs-body-log-column-host-foreground)

							&.path
								color var(--logs-body-log-column-path-foreground)

								.query
									color var(--logs-body-log-column-path-query-foreground)

							&.ua
								color var(--logs-body-log-column-ua-foreground)

							&.res
								color var(--logs-body-log-column-res-foreground)

								.status
									&.success
										color var(--logs-body-log-column-res-success-foreground)

									&.redirection
										color var(--logs-body-log-column-res-redirection-foreground)

									&.client-error
										color var(--logs-body-log-column-res-client-error-foreground)

									&.server-error
										color var(--logs-body-log-column-res-server-error-foreground)

								.time
									margin-left 8px
									color var(--logs-body-log-column-res-time-foreground)


	</style>

	<script>
		const seedrandom = require('seedrandom');

		this.mixin('stream');

		this.app = document.head.querySelector('[name=application-name]').content;
		this.follow = true;
		this.rec = true;
		this.logs = [];
		this.status = {};

		this.on('mount', () => {
			window.addEventListener('scroll', this.onScroll);
			this.stream.on('status', this.onStatus);
			this.stream.on('request', this.onRequest);
			this.stream.on('response', this.onResponse);
			this.clock = setInterval(this.tick, 1000);
		});

		this.on('unmount', () => {
			window.removeEventListener('scroll', this.onScroll);
			this.stream.off('status', this.onStatus);
			this.stream.off('request', this.onRequest);
			this.stream.off('response', this.onResponse);
			clearInterval(this.clock);
		});

		this.toggleFollow = () => {
			this.update({ follow: !this.follow });
			if (this.follow) {
				window.scroll(0, document.body.offsetHeight);
			}
		};

		this.toggleRec = () => {
			this.update({ rec: !this.rec });
		};

		this.export = e => {
			e.target.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(this.logs)));
		};

		this.clear = () => {
			this.update({
				logs: []
			});
		};

		this.onScroll = () => {
			const height = window.innerHeight;
			const scrollTop = window.scrollY;
			const documentHeight = document.body.offsetHeight;

			this.update({
				follow: height + scrollTop >= (documentHeight - 64)
			});
		};

		this.onStatus = status => {
			this.update({ status });
		};

		this.onRequest = req => {
			if (!this.rec) return;
			const random = seedrandom(req.remoteaddr);
			const r = Math.floor(random() * 255);
			const g = Math.floor(random() * 255);
			const b = Math.floor(random() * 255);
			const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b); // SMPTE C, Rec. 709 weightings
			req._url = new URL(req.url);
			req.bg = `rgb(${r}, ${g}, ${b})`;
			req.fg = luma >= 165 ? '#000' : '#fff';
			this.logs.push(req);
			if (this.logs.length > 1000) this.logs.shift();
			this.update();
		};

		this.onResponse = res => {
			const status = res.status.toString();
			switch (status[0]) {
				case '1': res.kind = 'informational'; break;
				case '2': res.kind = 'success'; break;
				case '3': res.kind = 'redirection'; break;
				case '4': res.kind = 'client-error'; break;
				case '5': res.kind = 'server-error'; break;
			}
			this.logs.some(log => {
				if (log.id === res.id) {
					log.res = res;
					return true;
				}
			});
			this.update();

			if (this.follow) {
				window.scroll(0, document.body.offsetHeight);
			}
		};

		this.tick = () => {
			const now = new Date();
			const yyyy = now.getFullYear();
			const mm = ('0' + (now.getMonth() + 1)).slice(-2);
			const dd = ('0' + now.getDate()).slice(-2);
			const hh = ('0' + now.getHours()).slice(-2);
			const nn = ('0' + now.getMinutes()).slice(-2);
			const ss = ('0' + now.getSeconds()).slice(-2);
			this.update({
				now: `${yyyy}/${mm}/${dd} ${hh}:${nn}:${ss}`
			});
		};

	</script>
</accesses-view>
