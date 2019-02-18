import {Utils} from '../../../libs/utils.js';
import {Validate} from '../../../libs/validate.js';

let web = getWeb();
let $utils = new Utils();

Page({
	data:{},
	smscodeTimer:0,
	validator: null,

	onReady: function( get ) {
        
        var that = this;
        
		// 加载表单验证类
		try {
			this.validator = new Validate({
				form:'.iframe-form',
				change: ( error, element)=>{ $utils.parentHeight(); },
				error: (message, extra)=>{ $utils.parentHeight(); },
				complete: ()=>{ $utils.parentHeight(); }
			});

        } catch( e ) { console.log( 'Error @Validate', e); }
        
	},


	/**
	 * 更换图片验证码
	 * @return {[type]} [description]
	 */
	changeVcode: function( event ){
        console.log( $('.toast').toast );
        var api = '/_api/xpmse/xpmse/staff/vcode?width=120&height=38&size=20&t=' + Date.parse(new Date()); 
        $(event.target).attr('src', api);
	},
})