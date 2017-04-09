<accesses-inspector-window>
	<accesses-window ref="window" width={ '650px' } height={ '400px' }>
		<yield to="header">{ parent.req.id }</yield>
		<yield to="content">
			<accesses-inspector ref="inspector" req={ parent.req } />
		</yield>
	</accesses-window>
	<script>
		this.req = this.opts.req;

		this.on('mount', () => {
			this.refs.window.refs.inspector.one('destroy', () => {
				this.refs.window.close();
				this.unmount();
			});
		});
	</script>
</accesses-inspector-window>
