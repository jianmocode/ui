
let web = getWeb();
Page({
	data:{},
	smscodeTimer:0,
	onReady: function( get ) {

		var that = this;

		// 自动播放更换背景
		that.changebg(0);
		that.fixheight();


		// 图形验证码
		$('.image.vcode').click(function(){
			that.changeVcode();
		});

		// 短信验证码
		$('.signup-form .smscode').click(function(){
			that.smscode();
		});

		// 提交表单
		// 
		$('.signup-form .signup').click(function(){
			that.submit();
		});

		
	},



	/**
	 * 提交注册表单
	 * @return {[type]} [description]
	 */
	submit: function(){
		var that =this;
		var api = '/_api/xpmsns/user/user/create';
		if ( that.validform(['mobile', 'password', 'repassword','_vcode', 'smscode'], {_vcode:true, smscode:true}) == true ) {
			var data = that.formdata();
				that.lockAction();
				$.post(api, data, function( resp ) {

					if ( resp == null ) {
						resp = {code:-1, message:'服务端错误， 请联系管理员'};
					}

					if (  resp['code'] != 0 ) {
						var message = resp['message'] || '服务端错误， 请联系管理员';
						that.changeVcode();
						that.alert(message);
						that.unlockAction();
						return;
					}

					// 注册成功 ( 5秒后转向登录 )
					that.cleanAlert();
					var backurl = $('[name="backurl"]').val() || "/user/home/index";
					var name = $('[name="backurl"]').attr('data-name') || "用户中心";
					that.redirect(backurl , "注册成功！", 5,  "后转向"+name+" <a href='/user/signin/mobile'>立即转向</a>");

					// that.success("注册成功");
					// that.redirect(5);
					// // that.unlockAction();

				}, 'json')
				.error(function(xhr, status, text){
					that.alert('网络错误，请联系管理员');
					that.unlockAction();
				});
		}
	},

	/**
	 * 发送短信验证码
	 * @return {[type]} [description]
	 */
	smscode: function() {
		var that = this;
		var api = '/_api/xpmsns/user/user/getSMSCode';

		if ( that.smscodeTimer <=0 ) {
			if ( that.validform(['mobile', '_vcode'], {_vcode:true}) == true ) {

				var data = that.formdata(['mobile', '_vcode']);
				that.lockAction();
				$.get(api, {'mobile':data['mobile'], '_vcode':data['_vcode']}, function( resp ){
					if ( resp['code'] != 0 ){
						var message = resp['message'] || '服务端错误， 请联系管理员';
						that.changeVcode();
						that.alert(message);
						that.unlockAction();
						return;
					}

					that.cleanAlert();
					that.unlockAction();
					that.smscodePending( 60 );

				}, 'json')
				.error(function(xhr, status, text){
					that.alert('网络错误，请联系管理员');
					that.unlockAction();
				});
			}
			// 
		}
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
	 * 锁定提交表单
	 * @return {[type]} [description]
	 */
	lockAction: function(){
		$('.signup-form .action').addClass('disabled').attr('disabled');
	},

	/**
	 * 解锁提交表单
	 * @return {[type]} [description]
	 */
	unlockAction: function(){
		$('.signup-form .action').removeClass('disabled').removeAttr('disabled');
	},


	/**
	 * 读取表单数据
	 * @param  {[type]} fields [description]
	 * @return {[type]}        [description]
	 */
	formdata: function( fields ){
		fields = fields || ['mobile', '_vcode', 'repassword', 'password', 'smscode'];
		var data = {};
		for( var i in fields ) {
			var field = fields[i];
			data[field]=$('.signup-form [name="'+field+'"]').val();
		}
		return data;
	},

	/**
	 * 校验表单
	 * @param  {[type]} fields [description]
	 * @return {[type]}        [description]
	 */
	validform: function( fields, silents ) {

		var that = this;
		var result = true;
		silents = silents || {};

		var getGroup = function( field ) {
			var el = $('.signup-form [name="'+field+'"]');
			var group = el.parent();
			if ( group.hasClass('input-group') ){
				group = group.parent();
			}
			var ico = el.parent().children('.icon');
			var helper = group.children('.help-block');
			return {group:group, el:el, ico:ico, helper:helper};
		}

		var error = function(field, message) {
			var g = getGroup(field);
			g.group.addClass('has-error');
			g.ico.addClass('hidden');
			g.helper.html(message);
		}

		var success = function( field, icon ) {
			var g = getGroup(field);
			if ( silents[field] !== true) {
				g.ico.removeClass('hidden');
			}
			g.group.removeClass('has-error').addClass('has-success');
			g.helper.html('');
		}


		for( var i in fields ) {
			var field = fields[i];
			var check = function(){ return that['_check_'+field]();} ;
			var message = true;
			try { message = check(); } catch(e){};

			if ( message === true ) {
				success(field);
			} else {
				result = false;
				error( field, message );
			}
		}

		return result;
	},


	_check_mobile: function(){

		var data = this.formdata(['mobile']);
		if ( data['mobile'].length != 11 ) {
			return "手机号码格式不正确";
		}
		return true;
	},

	_check__vcode: function(){


		var data = this.formdata(['_vcode']);

		if ( data['_vcode'].length != 4 ) {
			return "图形验证码应为4个字符";
		}

		return true;
	},

	_check_password: function(){
		var data = this.formdata(['password']);
		if ( data['password'].length  < 6 || data['password'].length > 16 ) {
			return "密码应为6~16位字符、数字组成";
		}
		return true;
	},

	_check_repassword: function(){
		var data = this.formdata(['password', 'repassword']);

		if( data['password'].length == 0 ) {
			return '请再输一遍密码';
		}

		if ( data['password'] != data['repassword'] ) {
			return "两次输入密码不一致";
		}

		return true;
	},

	_check_smscode: function(){
		var data = this.formdata(['smscode']);
		if ( data['smscode'].length != 4 ) {
			return "短信验证码应为4个数字";
		}
		return true;
	},

	/**
	 * 正在发送短信验证码
	 * @param  {[type]} timer [description]
	 * @return {[type]}       [description]
	 */
	smscodePending: function( timer ) {

		var that = this;

		that.smscodeTimer = timer;

		if ( timer <=0 ) {
			that.smscodeTimer = 0;
			$('.smscode')
				.removeAttr('disabled')
				.removeClass('disabled')
				.html('发送短信验证码');

			return;
		}

		$('.smscode')
			.attr('disabled', 'disabled')
			.addClass('disabled')
			.html(timer + ' 后可重发验证码');

		setTimeout(function(){
			that.smscodePending(  that.smscodeTimer -1 );
		}, 1000);
	},


	redirect: function( url, message, timer, name ) {
		var that = this;
		that.redirectTimer = timer;
		that.success( message +  timer  + name);

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
	 * 更换图片验证码
	 * @return {[type]} [description]
	 */
	changeVcode: function(){
		var api = '/_api/xpmsns/user/user/vcode?width=150&height=44&size=20&t=' + Date.parse(new Date()); 
		$('.image.vcode img').attr('src', api);
	},

	/**
	 * 修复高度
	 * @return {[type]} [description]
	 */
	fixheight: function() {
		$('.page').height($(document).height());
	},


	/**
	 * 自动更换背景
	 * @param  {[type]} curr [description]
	 * @return {[type]}      [description]
	 */
	changebg: function( curr ){

		var that = this;
		var images = this.data['images'] || [];
		var max = images.length;

		if ( max == 0 ) return;

		var images = this.data['images'] || [];
		var img = images[curr];
			$('.side').hide();
			$('.side').css('background-image', 'url('+img+')').fadeIn('fast');

		setTimeout(function(){
			
			curr ++;
			if ( curr >= max ) {
				curr = 0;
			}

			that.changebg(curr);
		}, 5000);
	},

	hello: function ( event ) {
	}
})