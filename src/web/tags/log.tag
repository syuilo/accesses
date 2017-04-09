<accesses-log>
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
			<tr each={ logs } tabindex="-1" id={ id } class={ intercepted: intercepted } onclick={ showlog } oncontextmenu={ logContextmenu }>
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

	<style>
		:scope
			display block

			> table
				margin-top 65px
				width 100%
				min-width 1000px
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

						&.intercepted
							outline solid 1px #f00
							outline-offset -2px

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

		this.logs = [];

		this.on('mount', () => {
			this.stream.on('response', this.onResponse);
		});

		this.on('unmount', () => {
			this.stream.off('response', this.onResponse);
		});

		this.export = e => {
			e.target.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(this.logs)));
		};

		this.clear = () => {
			this.update({
				logs: []
			});
		};

		this.appendRequest = req => {
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
					log.intercepted = false;
					log.res = res;
					return true;
				}
			});
			this.update();
		};

		this.showlog = e => {
			console.log(e.item);
		};

		this.logContextmenu = e => {
			e.preventDefault();
			/*this.stream.send({
				action: 'intercept-response',
				id: e.item.id,
				res: 'THIS REQUEST IS INTERCEPTED'
			});*/

			riot.mount(document.body.appendChild(document.createElement('accesses-inspector-window')), {
				req: e.item
			});
		};

	</script>

</accesses-log>
