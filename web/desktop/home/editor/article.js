import {Utils} from '../../../libs/utils.js';
import {$$} from '../../../libs/component.js';
import {Validate} from '../../../libs/validate.js';

$$.import(
	'uploader/image',
    'editor/image',
    'editor/html'
);

let $utils = new Utils();
Page({
	data:{},
	onReady: function( get ) {
        var that = this;

        // 加载组件
		try {
			// ImageUploader
			$$('uploader[type=image]').ImageUploader({
				change: ( data, $item )=>{ $utils.parentHeight(); },
				add: (event, data)=>{  return true; },
				beforeupload: (event, data)=>{  return true; },
				uploaded:(data, $item) =>{  $utils.parentNotification( '<span uk-icon="icon: check;ratio:1.3"></span>  上传成功', 'success', 'top-right'); },
				error: ( errors, $elm ) =>{
					for( var i in errors ){
						let error = errors[i];
						$utils.parentNotification( '<span uk-icon="icon: close;ratio:1.3"></span>  '+ error.message, 'danger', 'top-right');
					}
				}
			});
        } catch( e ) { console.log( 'Error @ImageUploader', e); }

        try {
            // HtmlEditor
            $$('editor[type=html]').HtmlEditor({});
        } catch( e ) { console.log( 'Error @HtmlEditor', e); }


        // 错误提醒框关闭事件
		try {
			UIkit.util.on('.uk-alert', 'hide', ()=>{
				setTimeout(()=>{$utils.parentHeight();}, 500);
			});
		} catch( e ) { console.log( 'Error @Alert Hide Event', e); }

		// 表单验证类
		try {
			this.validator = new Validate({
				form:'.iframe-form',
				change: (error, element)=>{ $utils.parentHeight(); },
				error: (message, extra)=>{ $utils.parentHeight(); },
				complete: ()=>{ $utils.parentHeight(); }
			});

        } catch( e ) { console.log( 'Error @Validate', e); }

    },
    
    test: function( event ) {
        let that = this;
        console.log( 'bindtap', that );
    }
})