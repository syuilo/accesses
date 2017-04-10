<x-node>
	<span if={ node }>{ node.release } { node.version } { node.lts || 'non-LTS' }</span>
	<span if={ !node }>---</span>

	<style>
		:scope
			display inline-block
			color #fff
	</style>

	<script>
		this.mixin('stream');

		this.on('mount', () => {
			this.stream.on('status', this.onStatus);
		});

		this.on('unmount', () => {
			this.stream.off('status', this.onStatus);
		});

		this.onStatus = status => {
			this.update({
				node: status.node
			});
		};
	</script>
</x-node>
