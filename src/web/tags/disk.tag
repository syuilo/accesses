<accesses-disk>
	<accesses-meter ref="meter" max={ total } /><span> DISK: { (100 - (100 * free / total)).toFixed(1) }%</span>

	<style>
		:scope
			display inline-block
			min-width 10em
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
				total: status.disk.total,
				free: status.disk.free
			});

			this.refs.meter.update({
				max: this.total,
				value: this.total - this.free
			});
		};
	</script>
</accesses-disk>
