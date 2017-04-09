<accesses-view>
	<header>
		<div>
			<div class="left">
				<p class="app">{ app }</p>
				<accesses-node />
				<p class="machine">MACHINE: { status.machine }</p>
				<p class="pid">PID: { status.pid }</p>
				<p class="uptime">UP: { status.uptime }s</p>
				<p class="now"><i class="fa fa-time"></i>{ now }</p>
			</div>
			<div class="right">
				<a class="export" href="#" onclick={ export }><i class="fa fa-download"></i>Export</a>
				<button class="clear" onclick={ clear }><i class="fa fa-times"></i>Clear</button>
				<button class="follow { enable: follow }" onclick={ toggleFollow }><i class="fa fa-sort-amount-desc"></i>Follow</button>
				<button class="intercept { enable: intercept }" onclick={ toggleIntercept }><i class="fa fa-{ intercept ? 'pause' : 'play' }"></i>INTERCEPT</button>
				<button class="rec { enable: rec }" onclick={ toggleRec }><i class="fa fa-{ rec ? 'pause' : 'play' }"></i>REC</button>
			</div>
		</div>
		<div>
			<accesses-cpu />
			<accesses-mem />
			<accesses-disk />
		</div>
	</header>

	<accesses-log ref="log" />

	<accesses-stream-indicator />

	<style>
		:scope
			display block

			> header
				display block
				position fixed
				z-index 10000
				top 0
				left 0
				width 100%
				font-size 0.8em
				background var(--header-background)

				> div
					white-space nowrap
					overflow hidden

				> div:nth-child(1)

					> .left, > .right
						background inherit
						white-space nowrap

						> *
							display inline-block
							line-height 32px
							vertical-align top

					> .left
						position relative

					> .right
						position absolute
						top 0
						right 0

						button, a
							-webkit-appearance none
							-moz-appearance none
							appearance none
							user-select none
							cursor pointer
							padding 0 12px
							margin 0
							font-size 1em
							text-decoration none
							color var(--header-button-foreground)
							outline none
							border none
							border-left solid 1px var(--header-separator-color)
							border-radius 0
							box-shadow none
							background transparent
							transition all .3s ease

							*
								pointer-events none

							> i
								margin-right 4px

							&:hover
								color var(--header-button-hover-foreground)
								transition all 0.1s ease

							&:active
								transition all 0s ease

					p
						margin 0
						padding 0

					.app
						padding 0 12px
						font-weight bold
						color var(--header-title-foreground)
						border-right solid 1px var(--header-separator-color)

					accesses-node
						padding 0 12px
						color var(--header-machine-foreground)
						border-right solid 1px var(--header-separator-color)

					.machine
						padding 0 12px
						color var(--header-machine-foreground)
						border-right solid 1px var(--header-separator-color)

					.pid
						padding 0 12px
						color var(--header-pid-foreground)
						border-right solid 1px var(--header-separator-color)

					.uptime
						padding 0 12px
						min-width 12em
						color var(--header-uptime-caption-foreground)
						border-right solid 1px var(--header-separator-color)

					.now
						padding 0 12px
						color var(--header-now-foreground)
						border-right solid 1px var(--header-separator-color)

						> i
							margin-right 6px

					.follow
						color var(--header-follow-foreground)
						transition all 0.2s ease

						> i
							margin-right 4px

						&.enable
							color #c1e31c

							&:hover
								color lighten(#c1e31c, 30%)
								transition all 0.1s ease

							&:active
								color darken(#c1e31c, 20%)
								transition all 0s ease

					.rec
						color var(--header-rec-foreground)
						background #000
						transition all 0.2s ease

						&:hover
							background #111
							transition all 0.1s ease

						&:active
							background #222
							transition all 0s ease

						&.enable
							color #fff
							background #f00

							&:hover
								background #f22

							&:active
								background #e00

						> i
							margin-right 4px

					.intercept
						color #fff
						background #000
						transition all 0.2s ease

						&:hover
							background #111
							transition all 0.1s ease

						&:active
							background #222
							transition all 0s ease

						&.enable
							background #00f

							&:hover
								background #22f

							&:active
								background #00e

						> i
							margin-right 4px

				> div:nth-child(2)
					border-top solid 1px var(--header-separator-color)

					> *
						display inline-block
						padding 0 12px
						line-height 32px
						border-right solid 1px var(--header-separator-color)

	</style>

	<script>
		this.mixin('stream');

		this.app = document.head.querySelector('[name=application-name]').content;
		this.follow = true;
		this.rec = true;
		this.intercept = false;
		this.status = {};

		this.on('mount', () => {
			window.addEventListener('scroll', this.onScroll);
			this.stream.on('status', this.onStatus);
			this.stream.on('request', this.onRequest);
			this.stream.on('intercept', this.onIntercept);
			this.clock = setInterval(this.tick, 1000);
		});

		this.on('unmount', () => {
			window.removeEventListener('scroll', this.onScroll);
			this.stream.off('status', this.onStatus);
			this.stream.off('request', this.onRequest);
			this.stream.off('intercept', this.onIntercept);
			clearInterval(this.clock);
		});

		this.toggleFollow = () => {
			this.update({ follow: !this.follow });
			if (this.follow) {
				window.scroll(0, document.body.offsetHeight);
			}
		};

		this.toggleRec = () => {
			this.update({ rec: !this.rec });
		};

		this.toggleIntercept = () => {
			this.stream.send({
				action: 'intercept'
			});
		};

		this.export = e => {
			this.refs.log.export(e);
		};

		this.clear = () => {
			this.refs.log.clear();
		};

		this.onScroll = () => {
			const height = window.innerHeight;
			const scrollTop = window.scrollY;
			const documentHeight = document.body.offsetHeight;

			this.update({
				follow: height + scrollTop >= (documentHeight - 64)
			});
		};

		this.onIntercept = intercept => {
			this.update({ intercept });
		};

		this.onStatus = status => {
			this.update({ status });
		};

		this.onRequest = req => {
			if (!this.rec) return;

			this.refs.log.appendRequest(req);

			if (this.follow) {
				window.scroll(0, document.body.offsetHeight);
			}
		};

		this.tick = () => {
			const now = new Date();
			const yyyy = now.getFullYear();
			const mm = ('0' + (now.getMonth() + 1)).slice(-2);
			const dd = ('0' + now.getDate()).slice(-2);
			const hh = ('0' + now.getHours()).slice(-2);
			const nn = ('0' + now.getMinutes()).slice(-2);
			const ss = ('0' + now.getSeconds()).slice(-2);
			this.update({
				now: `${yyyy}/${mm}/${dd} ${hh}:${nn}:${ss}`
			});
		};
	</script>
</accesses-view>
