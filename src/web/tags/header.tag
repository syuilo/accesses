<accesses-header>
	<div class="left">
		<p class="app">{ app }</p>
	</div>
	<div class="right">
		<div class="functions">
			<button><i class="fa fa-sort-amount-desc"></i></button>
		</div>
	</div>

	<style>
		$header-height = calc(1rem + 16px)

		:scope
			display block
			position sticky
			z-index 10000
			top 0
			left 0
			height $header-height
			width 100%
			font-size 0.8em
			background var(--header-background)

			left, right
				height $header-height
				background inherit
				white-space nowrap

				> *
					display inline-block
					line-height $header-height

				p
					margin 0
					padding 0

			left
				position absolute
				left 0

				info
					display inline-block

					> *
						display inline-block
						line-height $header-height

			right
				position absolute
				right 0

			actions
				border-left solid 1px var(--header-separator-color)

				> *
					display inline-block
					line-height $header-height

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
					border-right solid 1px var(--header-separator-color)
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

			.app
				padding 0 12px
				font-weight bold
				color var(--header-title-foreground)
				border-right solid 1px var(--header-separator-color)

			machine
				padding 0 12px
				color var(--header-machine-foreground)
				border-right solid 1px var(--header-separator-color)

				&:before
					content "MACHINE:"
					margin-right 4px
					color var(--header-machine-caption-foreground)

			pid
				padding 0 12px
				color var(--header-pid-foreground)
				border-right solid 1px var(--header-separator-color)

				&:before
					content "PID:"
					margin-right 4px
					color var(--header-pid-caption-foreground)

			uptime
				padding 0 12px
				min-width 12em
				color var(--header-uptime-caption-foreground)
				border-right solid 1px var(--header-separator-color)

				&:before
					content "UPTIME:"
					margin-right 4px
					color var(--header-uptime-caption-foreground)

				&:after
					content "s"

			#now
				padding 0 12px
				color var(--header-now-foreground)
				border-right solid 1px var(--header-separator-color)

				&:before
					content "\f017"
					font-family FontAwesome
					margin-right 6px

				.yyyymmdd
					margin-right 6px

			#follow
				color var(--header-follow-foreground)
				transition all .3s ease

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

			#rec
				color var(--header-rec-foreground)
				background #000
				transition all .3s ease

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

	</style>

	<script>
		this.app = document.head.querySelector('[name=application-name]').content;
	</script>
</accesses-header>
