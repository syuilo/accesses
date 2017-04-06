<accesses-meter>
	<div style="width:{ 100 * value / max }%; background:{ color };"></div>
	<style>
		:scope
			display inline-block
			width 128px
			height 8px
			background #222

			> div
				height 100%
	</style>
	<script>
		this.max = this.opts.max;
		this.value = this.opts.val;

		this.on('update', () => {
			const r = Math.floor(512 * this.value / this.max);
			const g = Math.floor(512 - (512 * this.value / this.max));
			this.color = `rgb(${r > 255 ? 255 : r}, ${g > 255 ? 255 : g}, 0)`;
		});
	</script>
</accesses-meter>
