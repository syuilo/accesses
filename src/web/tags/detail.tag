<x-detail>
	<span class="ip">{ req.ip }</span>
	<div><span class="method">{ req.method }</span><span class="url">{ req.url }</span></div>
	<dl>
		<dt>Requested at</dt>
		<dd>{ request.date }</dd>
	</dl>
	<button onclick={ interceptIp }>Intercept this IP</button>

	<style>
		:scope
			display block
			padding 16px
	</style>

	<script>
		this.mixin('stream');

		this.req = this.opts.req;

		this.on('mount', () => {
			this.stream.on('response', this.onResponse);
		});

		this.on('unmount', () => {
			this.stream.off('response', this.onResponse);
		});

		this.onResponse = res => {
			if (res.id == this.req.id) {
				this.req.intercepted = false;
				this.req.res = res;
				this.update();
			}
		};

		this.interceptIp = () => {
			this.stream.send({
				action: 'intercept-ip',
				ip: this.req.ip
			});
		};
	</script>
</x-detail>
