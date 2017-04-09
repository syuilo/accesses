<accesses-disk>
	<span><i class="fa fa-hdd-o"></i>DISK: { (100 - (100 * free / total)).toFixed(1) }% <span>({ (total / 1024 / 1024 / 1024).toFixed(1) }GB total, { ((total - free) / 1024 / 1024 / 1024).toFixed(1) }GB used, { (free / 1024 / 1024 / 1024).toFixed(1) }GB free)</span><accesses-meter ref="meter" max={ total } /></span>

	<style>
		:scope
			display inline-block
			color #fff

			> span
				display inline-block

				> i
					margin-right 8px

				> span
					margin-right 8px
					opacity 0.9

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
