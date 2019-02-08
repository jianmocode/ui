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


        let article = this.data.article || {};
        this.updateStatus( article.status, article.draft_status );

    },

    /**
     * 根据当前状态, 设定呈现样式
     * @param {string} status 
     */
    updateStatus: function( status, draft_status) {
        
        console.log( status, draft_status );

        // 审核中
        if ( status == "auditing" ) {
            this.lockAction();
            this.setStatus("warning", "审核中");
            this.showAction(["cancel"]);
        // 已发布
        } else if ( status == "published" ) {
            this.setStatus("success", "已发布");
            this.showAction(["update", "save", "preview"]);

        // 默认状态 (草稿)
        } else {
            // 默认状态
            this.setStatus("danger", "草稿");
            this.showAction(["save", "preview", "publish"]);
        }
    },

    showAction:function( actions ){

        $(`.action-method`).removeClass('action-active');

        for( var i in actions ) {
            $(`.action-${actions[i]}`)
                .removeClass('uk-hidden')
                .removeClass('uk-disabled')
                .removeAttr('disabled')
                .addClass('action-active')
            ;
        }
    },

    setStatus: function( className, name  ) {
        $('.status-label').html( name );
        $('.status-label')
            .removeClass('uk-label-success')
            .removeClass('uk-label-warning')
            .removeClass('uk-label-danger')
            .removeClass('uk-hidden')
        ;
        if ( className ) {
            $('.status-label').addClass(`uk-label-${className}`);
        }
    },

    lockAction: function(){
        $('.uk-action').addClass('uk-disabled')
                       .attr('disabled', 'disabled')
        ;
    },
    unlockAction: function(){
        $('.uk-action').removeClass('uk-disabled')
                       .removeAttr('disabled')
        ;
    },
    
    test: function( event ) {
        let that = this;
        console.log( 'bindtap', that );
    }
})