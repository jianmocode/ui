let web = getWeb();
Page({
	data:{},
	onReady: function( get ) {
		var that = this;
		that.redirect('/admin/login.html', '转向后台登录', 5);
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