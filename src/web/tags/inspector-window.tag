<x-inspector-window>
	<x-window ref="window" width={ '650px' } height={ '400px' }>
		<yield to="header">inspect: { parent.req.id }</yield>
		<yield to="content">
			<x-inspector ref="inspector" req={ parent.req } />
		</yield>
	</x-window>
	<script>
		this.req = this.opts.req;

		this.on('mount', () => {
			this.refs.window.refs.inspector.one('destroy', () => {
				this.refs.window.close();
				this.unmount();
			});
		});
	</script>
</x-inspector-window>
