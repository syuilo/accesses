<accesses-logs>
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
			<tr each={ logs }>
				<td class="date">{ date }</td>
				<td class="method">{ method }</td>
				<td class="host">{ url.hostname }</td>
				<td class="path">{ url.pathname }<span class="query" if={ url.search }>{ url.search }</span><span class="hash" if={ url.hash }>{ url.hash }</span></td>
				<td class="ua">{ headers['user-agent'] || '' }</td>
				<td class="ip">{ remoteaddr }</td>
				<td class="res"><span class="pending" if={ !res }>(pending)</span><span class="status-code" if={ res }>{ res.statusCode }</span></td>
			</tr>
		</tbody>
	</table>

	<style>
		:scope
			display block

			> table
				width 100%
				border-collapse collapse
				table-layout fixed

				.date
					width 9%

				.method
					width 4%

				.host
					width 12%

				.path
					width 22%

				.ua
					width 37%

				.ip
					width 10%

				.res
					width 6%

				> thead
					display block
					position sticky
					z-index 1
					top $header-height
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

							&:after
								font-family FontAwesome
								display block
								position absolute
								top 0
								right 8px
								bottom 0
								margin auto
								height 1em

							&.desc
								&:after
									content "\f106"

							&.asc
								&:after
									content "\f107"

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

							&, *
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

							&.host
								color var(--logs-body-log-column-host-foreground)

							&.path
								color var(--logs-body-log-column-path-foreground)

								.query
									color var(--logs-body-log-column-path-query-foreground)

							&.ua
								color var(--logs-body-log-column-ua-foreground)

							&.res
								color var(--logs-body-log-column-worker-foreground)
	</style>

	<script>
		this.mixin('stream');

		this.logs = [];

		this.on('mount', () => {
			this.stream.on('request', this.onRequest);
			this.stream.on('response', this.onResponse);
		});

		this.on('unmount', () => {
			this.stream.off('request', this.onRequest);
			this.stream.off('response', this.onResponse);
		});

		this.onRequest = req => {
			console.log(req);
			req.url = new URL(req.url);
			this.logs.push(req);
			this.update();
		};
	</script>
</accesses-logs>
