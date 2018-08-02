let web = getWeb();
Page({
	data:{},
	curr_ad:0,
	
	onReady: function( get ) {
		this.init();
	},

	init: function(){
	 	this.slide();
	 	// web.advPlay('.A-R-001');
	},

	/**
	 * 焦点图
	 * @return {[type]} [description]
	 */
	slide: function(){

		$('.slide .tags li').mouseover(function( event ){
			let id = $(this).attr('data-id');
			$('.slide .tags li').removeClass('active');
			$(this).addClass('active');

			$('.slide .items li').hide();
			$('.slide .items [data-id='+id+']').fadeIn();
		});
	}

})