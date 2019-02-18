let web = getWeb();
Page({
	data:{},
	onReady: function( get ) {

		var that = this;
		that.fixheight();
		that.redirect('/', '转向首页', 5);
	},

	/**
	 * 修复高度
	 * @return {[type]} [description]
	 */
	fixheight: function() {
		$('.page').height($(document).height());
	},


	redirect: function( url, message, timer, name ) {
		var that = this;
		that.redirectTimer = timer;
		$('.timer').html(timer);

		if ( timer <=1 ) {
			that.redirectTimer = 1;
			window.location = url;
			return;
		}

		setTimeout(function(){
			that.redirect( url,  message, that.redirectTimer -1, name );
		}, 1000);
	},

})