Web({

	load:function( web ) {
		$ = $ || function(){};
		this.fixNav();

		// 所有页面都运行的
		$(() => {
			try {
				$("[data-toggle='popover']").popover({trigger:'hover'});
			} catch (e) {}

			try {
				$("[data-toggle='slimscroll']").each( (idx,eml )=>{
					var h = $(eml).outerHeight() ;
					var size= $(eml).attr('data-size') || 4;
					var color = this.getColor($(eml).css('color'));
					try { $(eml).slimscroll({
						height: h + 'px',
						size: size + 'px',
						color: color
					}); } catch( e) {}
				})
			} catch(e) {}
			this.fixTooltip();
		});
	},


	getColor: function( rgb ){
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {return ("0" + parseInt(x).toString(16)).slice(-2);} 
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
	},

	fixNav: function() {
		let offsetTop = 80;
		$(window).scroll(function(event) {
			let top = $(window).scrollTop();
			if ( top >= offsetTop ) {
				$('.nav').css('top', '0px');
				$('.nav').addClass('fixed');

			} else if ( top < offsetTop ) {
				$('.nav').removeClass('fixed');
			}
		});
	},

	/**
	 * 优化 float-tooltip 呈现
	 * @return {[type]} [description]
	 */
	fixTooltip: function(){
		let margin = 32;
		let left = 0;
		try {
			left =  $('.container').offset().left +  $('.container').width()  +  margin;
		} catch(e) {};

		$('.float-tooltip').css('right', '0px');
		$('.float-tooltip').css('left', left + 'px');
		$('.float-tooltip').hide();
		$('.float-tooltip').removeClass('hidden');
		$('.float-tooltip').fadeIn();
	},

	onError:function( error ) {
		console.log( 'Error=', error, SERVICE_URL );
	},

	/**
	 * 轮播广告代码
	 * @return
	 */
	advPlay:function( selector, timeout ) {

		timeout = timeout || 2000;
		let next = 0;
		$(selector + ' a').each( (idx,item )=>{
			if ( !$(item).hasClass('hidden') ){
				next = idx + 1;
				// console.log( 'hasClass', idx);
			}
		});
		// console.log( next ,  $(selector + ' img').length);

		if (next >= $(selector + ' a').length ) {
			next = 0;
		}

		$(selector + ' a').addClass('hidden');
		$($(selector + ' a')[next]).removeClass('hidden');

		setTimeout(()=>{
			this.advPlay( selector, timeout );
		}, timeout);
	}
});