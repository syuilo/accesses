<accesses-window data-flexible={ isFlexible } ondragover={ ondragover }>
	<div class="main" ref="main" tabindex="-1" onmousedown={ onBodyMousedown } onkeydown={ onKeydown }>
		<div class="body">
			<header ref="header" onmousedown={ onHeaderMousedown }>
				<h1 data-yield="header"><yield from="header"/></h1>
				<button class="close" if={ canClose } onmousedown={ repelMove } onclick={ close } title="Close"><i class="fa fa-times"></i></button>
			</header>
			<div class="content" data-yield="content"><yield from="content"/></div>
		</div>
		<div class="handle top" if={ canResize } onmousedown={ onTopHandleMousedown }></div>
		<div class="handle right" if={ canResize } onmousedown={ onRightHandleMousedown }></div>
		<div class="handle bottom" if={ canResize } onmousedown={ onBottomHandleMousedown }></div>
		<div class="handle left" if={ canResize } onmousedown={ onLeftHandleMousedown }></div>
		<div class="handle top-left" if={ canResize } onmousedown={ onTopLeftHandleMousedown }></div>
		<div class="handle top-right" if={ canResize } onmousedown={ onTopRightHandleMousedown }></div>
		<div class="handle bottom-right" if={ canResize } onmousedown={ onBottomRightHandleMousedown }></div>
		<div class="handle bottom-left" if={ canResize } onmousedown={ onBottomLeftHandleMousedown }></div>
	</div>
	<style>
		:scope
			display block

			> .main
				display block
				position fixed
				z-index 20000
				top 15%
				left 0
				margin 0
				outline solid 1px #63c3ff

				> .handle
					$size = 8px

					position absolute

					&.top
						top -($size)
						left 0
						width 100%
						height $size
						cursor ns-resize

					&.right
						top 0
						right -($size)
						width $size
						height 100%
						cursor ew-resize

					&.bottom
						bottom -($size)
						left 0
						width 100%
						height $size
						cursor ns-resize

					&.left
						top 0
						left -($size)
						width $size
						height 100%
						cursor ew-resize

					&.top-left
						top -($size)
						left -($size)
						width $size * 2
						height $size * 2
						cursor nwse-resize

					&.top-right
						top -($size)
						right -($size)
						width $size * 2
						height $size * 2
						cursor nesw-resize

					&.bottom-right
						bottom -($size)
						right -($size)
						width $size * 2
						height $size * 2
						cursor nwse-resize

					&.bottom-left
						bottom -($size)
						left -($size)
						width $size * 2
						height $size * 2
						cursor nesw-resize

				> .body
					height 100%
					overflow hidden
					background rgba(0, 0, 0, 0.85)

					> header
						z-index 128
						overflow hidden
						cursor move
						box-shadow 0 1px 0px rgba(255, 255, 255, 0.3)

						&, *
							user-select none

						> h1
							pointer-events none
							display block
							margin 0
							height 40px
							text-align center
							font-size 1em
							line-height 40px
							font-weight normal
							color #fff

						> .close
							cursor pointer
							display block
							position absolute
							top 0
							right 0
							z-index 1
							margin 0
							padding 0
							font-size 1.2em
							color rgba(#fff, 0.7)
							border none
							outline none
							background transparent

							&:hover
								color #fff

							&:active
								color #f00

							> i
								padding 0
								width 40px
								line-height 40px

					> .content
						height 100%

			&:not([flexible])
				> .main > .body > .content
					height calc(100% - 40px)

	</style>
	<script>
		import contains from '../scripts/contains';

		this.minHeight = 40;
		this.minWidth = 200;

		this.canClose = this.opts.canClose != null ? this.opts.canClose : true;
		this.isFlexible = this.opts.height == null;
		this.canResize = !this.isFlexible;

		this.on('mount', () => {
			this.refs.main.style.width = this.opts.width || '530px';
			this.refs.main.style.height = this.opts.height || 'auto';

			this.refs.main.style.top = '15%';
			this.refs.main.style.left = (window.innerWidth / 2) - (this.refs.main.offsetWidth / 2) + 'px';

			this.refs.header.addEventListener('contextmenu', e => {
				e.preventDefault();
			});

			window.addEventListener('resize', this.onBrowserResize);

			this.top();
		});

		this.on('unmount', () => {
			window.removeEventListener('resize', this.onBrowserResize);
		});

		this.onBrowserResize = () => {
			const position = this.refs.main.getBoundingClientRect();
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.refs.main.offsetWidth;
			const windowHeight = this.refs.main.offsetHeight;
			if (position.left < 0) this.refs.main.style.left = 0;
			if (position.top < 0) this.refs.main.style.top = 0;
			if (position.left + windowWidth > browserWidth) this.refs.main.style.left = browserWidth - windowWidth + 'px';
			if (position.top + windowHeight > browserHeight) this.refs.main.style.top = browserHeight - windowHeight + 'px';
		};

		this.close = () => {
			this.unmount();
		};

		// 最前面へ移動します
		this.top = () => {
			let z = 0;

			const ws = document.querySelectorAll('accesses-window');
			ws.forEach(w => {
				if (w == this.root) return;
				const m = w.querySelector(':scope > .main');
				const mz = Number(document.defaultView.getComputedStyle(m, null).zIndex);
				if (mz > z) z = mz;
			});

			if (z > 0) {
				this.refs.main.style.zIndex = z + 1;
				if (this.isModal) this.refs.bg.style.zIndex = z + 1;
			}
		};

		this.repelMove = e => {
			e.stopPropagation();
			return true;
		};

		this.bgClick = () => {
			if (this.canClose) this.close();
		};

		this.onBodyMousedown = () => {
			this.top();
		};

		// ヘッダー掴み時
		this.onHeaderMousedown = e => {
			e.preventDefault();

			if (!contains(this.refs.main, document.activeElement)) this.refs.main.focus();

			const position = this.refs.main.getBoundingClientRect();

			const clickX = e.clientX;
			const clickY = e.clientY;
			const moveBaseX = clickX - position.left;
			const moveBaseY = clickY - position.top;
			const browserWidth = window.innerWidth;
			const browserHeight = window.innerHeight;
			const windowWidth = this.refs.main.offsetWidth;
			const windowHeight = this.refs.main.offsetHeight;

			// 動かした時
			dragListen(me => {
				let moveLeft = me.clientX - moveBaseX;
				let moveTop = me.clientY - moveBaseY;

				// 上はみ出し
				if (moveTop < 0) moveTop = 0;

				// 左はみ出し
				if (moveLeft < 0) moveLeft = 0;

				// 下はみ出し
				if (moveTop + windowHeight > browserHeight) moveTop = browserHeight - windowHeight;

				// 右はみ出し
				if (moveLeft + windowWidth > browserWidth) moveLeft = browserWidth - windowWidth;

				this.refs.main.style.left = moveLeft + 'px';
				this.refs.main.style.top = moveTop + 'px';
			});
		};

		// 上ハンドル掴み時
		this.onTopHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientY;
			const height = parseInt(getComputedStyle(this.refs.main, '').height, 10);
			const top = parseInt(getComputedStyle(this.refs.main, '').top, 10);

			// 動かした時
			dragListen(me => {
				const move = me.clientY - base;
				if (top + move > 0) {
					if (height + -move > this.minHeight) {
						this.applyTransformHeight(height + -move);
						this.applyTransformTop(top + move);
					} else { // 最小の高さより小さくなろうとした時
						this.applyTransformHeight(this.minHeight);
						this.applyTransformTop(top + (height - this.minHeight));
					}
				} else { // 上のはみ出し時
					this.applyTransformHeight(top + height);
					this.applyTransformTop(0);
				}
			});
		};

		// 右ハンドル掴み時
		this.onRightHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientX;
			const width = parseInt(getComputedStyle(this.refs.main, '').width, 10);
			const left = parseInt(getComputedStyle(this.refs.main, '').left, 10);
			const browserWidth = window.innerWidth;

			// 動かした時
			dragListen(me => {
				const move = me.clientX - base;
				if (left + width + move < browserWidth) {
					if (width + move > this.minWidth) {
						this.applyTransformWidth(width + move);
					} else { // 最小の幅より小さくなろうとした時
						this.applyTransformWidth(this.minWidth);
					}
				} else { // 右のはみ出し時
					this.applyTransformWidth(browserWidth - left);
				}
			});
		};

		// 下ハンドル掴み時
		this.onBottomHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientY;
			const height = parseInt(getComputedStyle(this.refs.main, '').height, 10);
			const top = parseInt(getComputedStyle(this.refs.main, '').top, 10);
			const browserHeight = window.innerHeight;

			// 動かした時
			dragListen(me => {
				const move = me.clientY - base;
				if (top + height + move < browserHeight) {
					if (height + move > this.minHeight) {
						this.applyTransformHeight(height + move);
					} else { // 最小の高さより小さくなろうとした時
						this.applyTransformHeight(this.minHeight);
					}
				} else { // 下のはみ出し時
					this.applyTransformHeight(browserHeight - top);
				}
			});
		};

		// 左ハンドル掴み時
		this.onLeftHandleMousedown = e => {
			e.preventDefault();

			const base = e.clientX;
			const width = parseInt(getComputedStyle(this.refs.main, '').width, 10);
			const left = parseInt(getComputedStyle(this.refs.main, '').left, 10);

			// 動かした時
			dragListen(me => {
				const move = me.clientX - base;
				if (left + move > 0) {
					if (width + -move > this.minWidth) {
						this.applyTransformWidth(width + -move);
						this.applyTransformLeft(left + move);
					} else { // 最小の幅より小さくなろうとした時
						this.applyTransformWidth(this.minWidth);
						this.applyTransformLeft(left + (width - this.minWidth));
					}
				} else { // 左のはみ出し時
					this.applyTransformWidth(left + width);
					this.applyTransformLeft(0);
				}
			});
		};

		// 左上ハンドル掴み時
		this.onTopLeftHandleMousedown = e => {
			this.onTopHandleMousedown(e);
			this.onLeftHandleMousedown(e);
		};

		// 右上ハンドル掴み時
		this.onTopRightHandleMousedown = e => {
			this.onTopHandleMousedown(e);
			this.onRightHandleMousedown(e);
		};

		// 右下ハンドル掴み時
		this.onBottomRightHandleMousedown = e => {
			this.onBottomHandleMousedown(e);
			this.onRightHandleMousedown(e);
		};

		// 左下ハンドル掴み時
		this.onBottomLeftHandleMousedown = e => {
			this.onBottomHandleMousedown(e);
			this.onLeftHandleMousedown(e);
		};

		// 高さを適用
		this.applyTransformHeight = height => {
			this.refs.main.style.height = height + 'px';
		};

		// 幅を適用
		this.applyTransformWidth = width => {
			this.refs.main.style.width = width + 'px';
		};

		// Y座標を適用
		this.applyTransformTop = top => {
			this.refs.main.style.top = top + 'px';
		};

		// X座標を適用
		this.applyTransformLeft = left => {
			this.refs.main.style.left = left + 'px';
		};

		function dragListen(fn) {
			window.addEventListener('mousemove',  fn);
			window.addEventListener('mouseleave', dragClear.bind(null, fn));
			window.addEventListener('mouseup',    dragClear.bind(null, fn));
		}

		function dragClear(fn) {
			window.removeEventListener('mousemove',  fn);
			window.removeEventListener('mouseleave', dragClear);
			window.removeEventListener('mouseup',    dragClear);
		}

		this.ondragover = e => {
			e.dataTransfer.dropEffect = 'none';
		};

		this.onKeydown = e => {
			if (e.which == 27) { // Esc
				if (this.canClose) {
					e.preventDefault();
					e.stopPropagation();
					this.close();
				}
			}
		};

	</script>
</accesses-window>
