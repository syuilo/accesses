<x-meter>
	<div class="afterimage" if={ prev } style="width:{ 100 * prev.value / prev.max }%; background:{ prev.color };"></div>
	<div style="width:{ 100 * value / max }%; background:{ color };"></div>
	<style>
		:scope
			display inline-block
			position relative
			width 128px
			height 8px
			background #222

			> div
				position absolute
				top 0
				left 0
				height 100%
				transition all 0.2s ease

				&.afterimage
					opacity 0.5

	</style>
	<script>
		this.max = this.opts.max;
		this.value = this.opts.val;

		this.on('update', () => {
			const r = Math.floor(512 * this.value / this.max);
			const g = Math.floor(512 - (512 * this.value / this.max));
			this.color = `rgb(${r > 255 ? 255 : r}, ${g > 255 ? 255 : g}, 0)`;
		});

		this.on('updated', () => {
			this.prev = {
				max: this.max,
				value: this.value,
				color: this.color
			};
		});
	</script>
</x-meter>
