import {Utils} from '../../../libs/utils.js';
import {Validate} from '../../../libs/validate.js';
import ImageUploader from '../../components/uploader/image';  // 下一版应该可以自动引用组件

let $utils = new Utils();
let web = getWeb();
let $$ = UIkit.util;

Page({
	data:{},
	smscodeTimer:0,
	validator: null,
	uploader: null,
	onReady: function( get ) {

		var that = this;

		// // 引用组件
		try {
			ImageUploader.$load({
				selector:'uploader[type=image]',
				change: ( uploader, $item, src )=>{ $utils.parentHeight(); },
				error: (uploader, errors, $elm ) =>{
					for( var i in errors ){
						let error = errors[i];
						$utils.parentNotification( '<span uk-icon="icon: close;ratio:1.3"></span>  '+ error.message, 'danger', 'top-right');
					}
				}, 
				success: (uploader, $elm, $item, src) =>{
					$utils.parentNotification( '<span uk-icon="icon: check;ratio:1.3"></span>  上传成功', 'success', 'top-right');
				}
			});

			this.uploader = ImageUploader.options;

		}  catch( e ) { console.log( 'Error @ImageUploader', e); }

		// 错误提醒框关闭事件
		try {
			$$.on('.uk-alert', 'hide', ()=>{
				setTimeout(()=>{$utils.parentHeight();}, 500);
			});
		} catch( e ) { console.log( 'Error @Alert Hide Event', e); }

		// 表单验证类
		try {
			this.validator = new Validate({
				form:'.iframe-form',
				change: ( error, element)=>{ $utils.parentHeight(); },
				error: (message, extra)=>{ $utils.parentHeight(); },
				complete: ()=>{ $utils.parentHeight(); }
			});

		} catch( e ) { console.log( 'Error @Validate', e); }

		// 图形验证码
		$('.image.vcode').click(function(){
			that.changeVcode();
		});

		// setTimeout(()=>{
		// 	$('uploader[type=image]').removeAttr('disabled');
		// },1000);
	},


	/**
	 * 更换图片验证码
	 * @return {[type]} [description]
	 */
	changeVcode: function(){
		var api = '/_api/xpmsns/user/user/vcode?width=150&height=40&size=20&t=' + Date.parse(new Date()); 
		$('.image.vcode img').attr('src', api);
	},
})