let web = getWeb();

Page({
	data:{},
	onReady: function( params ) {

		$('.iframe-player').on('load', function(){
			$('.player .loading').addClass('uk-hidden');
		});
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