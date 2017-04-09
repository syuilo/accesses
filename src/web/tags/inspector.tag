<accesses-inspector>
	<p>{ req.url }</p>
	<button onclick={ drop }>Drop</button>
	<button onclick={ bypass }>Bypass</button>

	<div class="forgery">
		<p>Response forgery</p>
		<input type="number" value="200" ref="forgeryStatus">
		<textarea ref="forgeryBody"></textarea>
		<button onclick={ send }>Send</button>
	</div>

	<style>
		:scope
			display block
			padding 16px

			> .forgery
				> textarea
					display block
					width 100%
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
				this.trigger('destroy');
			}
		};

		this.bypass = () => {
			this.stream.send({
				action: 'bypass',
				id: this.req.id
			});
		};

		this.drop = () => {
			this.stream.send({
				action: 'response',
				id: this.req.id,
				res: {
					status: 403
				}
			});
		};

		this.send = () => {
			this.stream.send({
				action: 'response',
				id: this.req.id,
				res: {
					status: this.refs.forgeryStatus.value,
					body: this.refs.forgeryBody.value
				}
			});
		};
	</script>
</accesses-inspector>
