let web = getWeb();

Page({
	data:{},
	onReady: function( params ) {
		$('.iframe-player').on('load', ()=>{
			$('.jm-player .loading').addClass('uk-hidden');
			this.fixHeight();
		});
	},


	fixHeight: function() {
		let w = $('.jm-player').outerWidth();
		let ratio = 9/16;
		let fixh = w * ratio;
		let elm = '.jm-player';
		$(elm).height(fixh);
		$(elm).width(w);

		// fix iframe
		$(elm).find('iframe').height(fixh);
		$(elm).find('iframe').width(w);
		$(elm).find('iframe').attr('height', fixh);
		$(elm).find('iframe').attr('width', w);
		$(elm).find('iframe').removeClass('uk-hidden');


		// fix video
		$(elm).find('video').height(fixh);
		$(elm).find('video').width(w);
		$(elm).find('video').attr('height', fixh);
		$(elm).find('video').attr('width', w);
		$(elm).find('video').removeClass('uk-hidden');
	},

	initShareNavbar: function() {
		let pos = $('.share-navbar').offset();
		let width = $('.share-navbar').outerWidth();
		let winHeight = $(window).outerHeight();
		let top =  pos.top;
		let left = pos.left;
		let offset = 20;

		function setPos ( t ) {

			if ( t < (top + offset ) ) {
				$('.share-navbar')
					.addClass('uk-position-fixed')
					.addClass('uk-position-bottom');
				$('.share-navbar').css('width', width +  'px');
				$('.share-navbar').css('left', left +  'px');
			} else {


				$('.share-navbar')
					.removeClass('uk-position-fixed')
					.removeClass('uk-position-bottom');
				$('.share-navbar').css('left', 0 +  'px');
			}
		}

		setPos(  $(window).scrollTop() + winHeight );
		$(window).scroll(function(event) {

			let t = $(window).scrollTop();
			setPos( t + winHeight );
		});
	}
})