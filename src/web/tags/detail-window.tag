<x-detail-window>
	<x-window ref="window" width={ '650px' } height={ '400px' }>
		<yield to="header">{ parent.req.id }</yield>
		<yield to="content">
			<x-detail req={ parent.req } />
		</yield>
	</x-window>
	<script>
		this.req = this.opts.req;
	</script>
</x-detail-window>
