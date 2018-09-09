/**
 * 简墨 Validate 
 */
class UtilsClass {

	constructor( option={} ) {
	}

	parentHeight( iframe='iframe' ){
		// console.log( 'run parentHeight ');
		try {
			// 如果是 iframe 载入，调整iframe 高度
			if ( window.parent.$ ) {
				let height = $('body').height();
				window.parent.$('iframe').height(height);
			}
		}catch( e ){
			console.log('fix iframe height Error', e );
		}
	}

	parentClose( iframe='iframe'  ){

		// console.log( 'run parentClose ');

		try {
			// 如果是 iframe 载入，调整iframe 高度
			if ( window.parent.$ ) {
				let height = $('body').height();
				window.parent.$('iframe').height(height);
			}
		}catch( e ){
			console.log('fix iframe height Error', e );
		}
	}
}
let Utils = new UtilsClass();

class Validate {
	
	constructor( option={} ) {

		let that =this;
		this.option(option);
		this.form = option['form'] || 'form';
		this.change = option['change'] || function(){};
		this.loading = function(){
			$('.uk-action').prop('disabled', true);
			let origin = $('[uk-loading]').html();
			let option = $('[uk-loading]').attr('uk-loading');
			$('[uk-loading]').attr('data-origin', origin );
			$('[uk-loading]').html('<span uk-spinner="'+option+'"></span> ' +  origin );
		}

		this.complete = function(){
			$('.uk-action').removeAttr('disabled');	
			let origin = $('[uk-loading]').attr('data-origin');
			$('[uk-loading]').html(origin);
		}


		this.error = function( message, extra ) {
			let errorList = extra['errorlist'] || [];
			for ( let i in errorList ) {
				that.instance.showErrors(errorList[i]) ;
			}

			$('.message')
				.removeClass('uk-hidden')
				.find('p').html('操作失败 (' + message + ')');

			Utils.parentHeight();
		}



		this.submit = option['submit'] || function( form, opts={} ) {

			let v = this;

			// 锁定操作
			let loading = that.loading;

			// 解锁操作
			let complete = that.complete;

			// 通报错误
			let error = that.error;

			// 成功返回
			let successText = $(form).attr('success');
			let success = null
			try { eval('success=' + successText );} catch( e) {
				success = successText;
				console.log( 'success callback error:', successText, e );
			}


			// 开始请求前锁定表单 
			loading();
			let $form = $(form).ajaxSubmit({
				dataType: 'json',
				type: opts['method'] || $(form).attr('method') || 'POST',
				url:  opts['url'] || $(form).attr('action') || ''
			});

			let xhr = $form.data('jqxhr');
			xhr.done(function( resp, status ) {
				
				// 请求完成
				complete();

				if ( 
					( typeof resp['code'] != 'undefined' &&  typeof resp['message'] != 'undefined' && resp['code'] != 0  ) ||
					status != 'success'
				) {
					let message = resp['message'] || status;
					let extra = resp['extra'] || {};
					error( message, extra);
					return;
				}

				// 成功返回
				if (typeof success != 'function') {
					window.location = success;
					return;
				}
				success( resp );

			});
		}
		this.inst = this.instance = null;
		this.init();
	}

	option(option) {
		this.option = option;
	}

	init() {

		let that = this;
		let $validates = (this.form) ? $('[validate]', this.form) : $('[validate]');
		let $form = (this.form) ? $(this.form) : $('form');

		// 设定错误通报方式
		this.inst = this.instance = $form.validate({
			debug:true,
			errorClass: 'uk-helper uk-form-danger',
            errorElement: 'div',
            errorPlacement: function(error, element) {  
            	let $input = $(element);      
            	let $formgroup = $input.parents('.uk-form-group'); 
            	let $helper = $formgroup.find('.uk-helper-danger');
            	let message = error.html();
            	$helper.html(error.html());
            	try { that.change(error, element);} catch(e){
            		console.log('callback change error:', e, this.change);
            	}
            },

            highlight: function( element ) {
                let $input = $(element);  
                let $formgroup = $input.parents('.uk-form-group'); 
            	let $helper = $formgroup.find('.uk-helper-danger');
                $input.addClass('uk-form-danger');
                $helper.addClass('uk-form-danger');
            },
            unhighlight:function(element){
                let $input = $(element);  
                let $formgroup = $input.parents('.uk-form-group'); 
            	let $helper = $formgroup.find('.uk-helper-danger');
                $input.removeClass('uk-form-danger');
                $helper.removeClass('uk-form-danger');
            },
            success: function(element) {
            	// console.log( 'success', $(element) );
                let $formgroup = $(element).parents('.uk-form-group'); 
              	$formgroup.find('.uk-form-danger').removeClass('uk-form-danger');

            },
            
            submitHandler: that.submit
		});

		// 加载 rules
		$validates.each(( idx, item )=>{
			let ruleString = $(item).attr('validate');
			let rule = {};
			try { 
				eval('rule=' + ruleString );
			} catch( e) {
				rule = {};
				console.log('load rule error:', e.message, ruleString);
			}
			$(item).rules('add', rule );
		})
	}
}



export { Validate, Utils }