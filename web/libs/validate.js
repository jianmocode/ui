import { Utils } from './utils.js';
/**
 * 简墨验证类
 */
class Validate {
	
	constructor( option={} ) {

		let that =this;
		let $validate = this;
		this.utils = new Utils(); 
		this.events = {}
		this.option(option);
		this.form = option['form'] || 'form';
		this.events['change'] = option['change'] || function(){};
		this.events['error'] = option['error'] || function(){};
		this.events['complete'] = option['complete'] || function(){};

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
			$('.message').addClass('uk-hidden');

			try { that.events.complete(); } catch(e){
				console.log('callback error error:', e, this.events.complete);
			}
		}


		this.error = function( message, extra ) {
			let errorList = extra['errorlist'] || [];
			for ( let i in errorList ) {
				that.instance.showErrors(errorList[i]) ;
			}

            if ( errorList.length < 1 ) {
                $('.message')
                    .removeClass('uk-hidden')
                    .find('p').html('操作失败 (' + message + ')');
            }

			try { that.events.error(message, extra);} catch(e){
				console.log('callback error error:', e, this.events.error);
			}
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
				filtering: (el, index)=>{ if ( !$(el).hasClass('uk-field-ignore') && !$(el).hasClass('jm-field-ignore') ) { return el; } },
				dataType: 'json',
				type: opts['method'] || $(form).attr('method') || 'POST',
				url:  opts['url'] || $(form).attr('action') || ''
			});

			let xhr = $form.data('jqxhr');
			if ( !xhr ) return;
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
		// [bug]?? helper info missing when second time submit
		// https://jqueryvalidation.org/documentation/
		this.inst = this.instance = $form.validate({
			debug:true,
			errorClass: 'uk-helper uk-form-danger',
			errorElement: 'div',
			errorPlacement: function(error, element) {  
                // console.log( 'errorPlacement', $(element) );
				let $input = $(element);	  
                let $formgroup = $input.parents('.uk-form-group'); 
                if ( $formgroup.length == 0 ) {
                    $formgroup = $input.parents('.form-group'); 
                }
                
                let $helper = $formgroup.find('.uk-helper-danger');
				let message = error.html();
				$helper.html(message);
                $helper.show();
                
                if ( $helper.length == 0 ) {
                    $helper = $formgroup.find('.invalid-feedback'); 
                    $helper.html( message );
                    $input.addClass('is-invalid');
                }

				
				// fix bug display:none bug 10ms 延迟 ??? 
				setTimeout(()=>{
					$helper.html(message);
					$helper.fadeIn();
					try { that.events.change(error, element);} catch(e){
						console.log('callback change error:', e, this.events.change);
                    }
                    
                    try { that.events.error(error, element);} catch(e){
						console.log('callback  error:', e, this.events.change);
					}
				}, 10);
			},

			highlight: function( element ) {
				let $input = $(element);  
				let $formgroup = $input.parents('.uk-form-group'); 
				let $helper = $formgroup.find('.uk-helper-danger');
				let $component = $input.parents('.jm-component');
				$input.addClass('uk-form-danger');
				$helper.addClass('uk-form-danger');
				$component.addClass('jm-error');
			},
			unhighlight:function(element){
				let $input = $(element);  
				let $formgroup = $input.parents('.uk-form-group'); 
				let $helper = $formgroup.find('.uk-helper-danger');
				$input.removeClass('uk-form-danger');
                $helper.removeClass('uk-form-danger');
                $input.removeClass('is-invalid');
			},
			success: function(element) {
                let $input = $(element);  
				let $formgroup = $(element).parents('.uk-form-group'); 
				let $component = $(element).parents('.jm-component');
			  	$formgroup.find('.uk-form-danger').removeClass('uk-form-danger');
                $component.removeClass('jm-error');
                $input.removeClass('is-invalid').addClass('is-valid');
                    
			},

			ignore: function (index, el) {
                
                var $el = $(el);
                
                if ($el.hasClass('always-validate')) {
                    return false;
                }
                
                if ( $el.hasClass('trix-input') ) {
                    return true;
                }
                
                if ( $el.hasClass('attachment__caption-editor') ) {
                    return true;
                }

                if ( $el.hasClass('attachment__caption') ) {
                    return true;
                }
                
                if ( $el.attr('name') == undefined ) {
                    return true;
                }

                if ( $el.prop('tagName') === 'TRIX-EDITOR' ) {
                    return true;
                }

                if ( $el.hasClass('attachment--preview') ) {
                    return true;
                }

                if ( $el.hasClass('attachment--content') ) {
                    return true;
                }

			   	if ( $el.hasClass('uk-field-ignore') || $el.hasClass('jm-field-ignore') ) {
			   		return true;
                }

				return $el.is(':hidden'); // default
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
				console.log('load rule error:', $(item), e.message, ruleString);
			}
			$(item).rules('add', rule );
		})
	}
}



export { Validate }