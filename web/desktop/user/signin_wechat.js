
let web = getWeb();
Page({
	
	data:{},
	qrcodeTimer:0,
	onReady: function( get ) {
		var that = this;
		that.fixheight();
		that.refreshQRCode(30);
		that.refreshUserinfo();
	},


	/**
	 * 警告弹窗
	 * @param  string message 消息内容
	 * @return
	 */
	alert: function( message ) {
		$('.signup-form .alert-danger')
			.removeClass('hidden')
			.children('.message')
			.html( message );
	},


	success: function( message ) {
		$('.signup-form .alert-success')
			.removeClass('hidden')
			.children('.message')
			.html( message );
	},


	/**
	 * 关闭警告弹窗
	 * @return {[type]} [description]
	 */
	cleanAlert: function(){
		$('.signup-form .alert').addClass('hidden');
	},


	/**
	 * 正在发送短信验证码
	 * @param  {[type]} timer [description]
	 * @return {[type]}       [description]
	 */
	refreshQRCode: function( timer ) {

		var that = this;

		that.qrcodeTimer = timer;
		$('.qrcodeTimer').html(timer);

		if ( timer <=0 ) {
			$.get("/_api/xpmsns/user/user/wechatSigninQrcode", function(data) {
				var url = data['url'] + '&t=' + Date.parse(new Date());
				$('img[name="qrcode"]').attr('src', url);
				that.refreshQRCode(30);
			}, 'json');
			return;
		}

		setTimeout(function(){
			that.refreshQRCode(  that.qrcodeTimer -1 );
		}, 1000);
	},


	refreshUserinfo: function() {
		var that = this;

		if ( that.refreshUserinfoPending === true) {
			setTimeout(function(){
				that.refreshUserinfo();
			}, 3000);
			return;
		}

		that.refreshUserinfoPending = true;
		$.get("/_api/xpmsns/user/user/getUserInfo", function(data) {
			
			that.refreshUserinfoPending = false;

			if ( typeof data['user_id'] != 'undefined') {

				var option = that.data.option;
				if ( option.user_bind_mobile  == 1 && 
					 data.mobile == null ) {

					// 转向绑定手机号页面
					that.redirect("/user/bind/mobile", "登录成功", -1, "绑定手机号码");
					
					return;
				}

				var backurl = $('[name="backurl"]').val() || "/user/home/index";
				var name = $('[name="backurl"]').attr('data-name') || "用户中心";
				that.redirect(backurl, "登录成功", -1, name);
				return;
			}

			setTimeout(function(){
				that.refreshUserinfo();
			}, 3000 );

		}, 'json');
	},


	redirect: function( url, message, timer, name ) {
		var that = this;
		that.redirectTimer = timer;
		// that.success( message +  timer  + name);

		if ( timer <=0 ) {
			that.redirectTimer = 0;
			window.location = url;
			return;
		}

		setTimeout(function(){
			that.redirect( url,  message, that.redirectTimer -1, name );
		}, 1000);
	},




	/**
	 * 修复高度
	 * @return {[type]} [description]
	 */
	fixheight: function() {
		$('.page').height($(document).height());
	}
})