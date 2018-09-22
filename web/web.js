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


			// modal 载入 iframe 窗体
			try {
				UIkit.util.on("[uk-iframe-modal]", "click", function (e) {

					// 设定为Loading提示
					$('#modal-iframe .loading').removeClass('uk-hidden');
					$('#modal-iframe .loaded').addClass('uk-hidden');

					e.preventDefault();
        			e.target.blur();
        			let link = e.target.getAttribute("href");
        			let w = e.target.getAttribute("data-width") || 600;
        			let h = e.target.getAttribute("data-height") || 400;
        			let html =  '<iframe width="100%" height="'+h+'" src="'+ link +'" frameborder="0"  scrolling="no"  style="border-radius: 6px;" allowfullscreen></iframe>'
								;
					$('#modal-iframe .iframe').html(html);
					$('#modal-iframe .uk-modal-body').width(w);
					$('#modal-iframe .uk-modal-body').height(h);

					// 窗口载入完毕
					$('#modal-iframe iframe').load(function( event ){

						$('#modal-iframe .loading').addClass('uk-hidden');
						$('#modal-iframe .loaded').removeClass('uk-hidden');
					
						// auto height
						let frameH = $(this).contents().find("body").height();
						$('#modal-iframe .uk-modal-body').height(frameH);
						$(this).attr('height', frameH);
						$(this).css('height', frameH);

						// console.log('iframe load and height is:', frameH);
						
					});

        			UIkit.modal('#modal-iframe').show();
					
				});
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

				$('.totop').removeClass('uk-hidden');

			} else if ( top < offsetTop ) {
				$('.nav').removeClass('fixed');
				$('.totop').addClass('uk-hidden');
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