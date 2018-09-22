import { Utils } from '../../libs/utils.js';
import {Validate} from '../../libs/validate.js';

let web = getWeb();
let $$ = UIkit.util;
let $Utils = new Utils(); 

Page({
	data:{},
	smscodeTimer:0,
	validator: null,

	onReady: function( get ) {
		var that = this;

		// 错误提醒框关闭事件
		try {
			$$.on('.uk-alert', 'hide', ()=>{
				setTimeout(()=>{$Utils.parentHeight();}, 500);
			});
		} catch( e ) { console.log( 'Error @Alert Hide Event', e); }

		// 表单验证类
		try {
			this.validator = new Validate({
				form:'.iframe-form',
				change: ( error, element)=>{ $Utils.parentHeight(); },
				error: (message, extra)=>{ $Utils.parentHeight(); },
				complete: ()=>{ $Utils.parentHeight(); }
			});

		} catch( e ) { console.log( 'Error @Validate', e); }


		// 图形验证码
		$('.image.vcode').click(function(){
			that.changeVcode();
		});

		// 短信验证码
		$('.iframe-form .smscode').click(function(){
			that.smscode();
		});

	},


	/**
	 * 发送短信验证码
	 * @return {[type]} [description]
	 */
	smscode: function() {
		var that = this;
		var api = '/_api/xpmsns/user/user/getSMSCode';

		if ( that.smscodeTimer <=0 ) {

			if ( 
				 !that.validator.inst.element('[name=mobile]') ||
				 !that.validator.inst.element('[name=_vcode]')
				) {
				return false;
			}

			$.get(api, {'mobile':$('[name=mobile]').val(), '_vcode':$('[name=_vcode]').val()}, function( resp ){
				if ( resp['code'] != 0 ){
					var message = resp['message'] || '服务端错误， 请联系管理员';
					that.validator.error(message, resp['extra'] || {} );
					return;
				}
				that.smscodePending( 60 );

			}, 'json')

			.error(function(xhr, status, text){
				that.validator.error(message,{} );
			});
		}
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
				.html('发送验证码');

			return;
		}

		$('.smscode')
			.attr('disabled', 'disabled')
			.addClass('disabled')
			.html(timer + ' 后可重发');

		setTimeout(function(){
			that.smscodePending(  that.smscodeTimer -1 );
		}, 1000);
	},

	/**
	 * 更换图片验证码
	 * @return {[type]} [description]
	 */
	changeVcode: function(){
		var api = '/_api/xpmsns/user/user/vcode?width=150&height=40&size=20&t=' + Date.parse(new Date()); 
		$('.image.vcode img').attr('src', api);
	}
})