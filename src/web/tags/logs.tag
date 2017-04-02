<accesses-logs>
	<div class="left">

	</div>

	<script>
		this.mixin('stream');

		this.on('mount', () => {
			this.stream.on('request', this.onRequest);
			this.stream.on('response', this.onResponse);
		});

		this.on('unmount', () => {
			this.stream.off('request', this.onRequest);
			this.stream.off('response', this.onResponse);
		});

		this.onRequest = req => {
			alert(req.url);
		};
	</script>
</accesses-logs>
