<accesses-view>
	<accesses-header ui={ this } />
	<accesses-logs ui={ this } />

	<style>
		:scope
			display block
	</style>

	<script>
		this.follow = true;

		this.on('mount', () => {
			window.addEventListener('scroll', this.onScroll);
		});

		this.on('unmount', () => {
			window.removeEventListener('scroll', this.onScroll);
		});

		this.onScroll = () => {
			const height = window.innerHeight;
			const scrollTop = window.scrollY;
			const documentHeight = document.body.offsetHeight;

			this.follow = height + scrollTop >= (documentHeight - 64);
		};
	</script>
</accesses-view>
