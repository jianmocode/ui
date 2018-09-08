/**
 * 简墨 Validate 
 */

class Validate {
	
	constructor( option={} ) {
		this.option(option);
		this.form = option['form'] || null;
		this.change = option['change'] || function(){};
		this.v = null;
	}

	option(option) {
		this.option = option;
	}

	init() {

		let that = this;
		let $validates = (this.form) ? $('[validate]', this.form) : $('[validate]');
		let $form = (this.form) ? $(this.form) : $('form');

		// 设定错误通报方式
		$form.validate({
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
                let $input = $(element);  
                let $formgroup = $input.parents('.uk-form-group'); 
            	let $helper = $formgroup.find('.uk-helper-danger');
                $input.removeClass('uk-form-danger');
                $helper.removeClass('uk-form-danger');
            }
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


export { Validate }