let web = getWeb();
let com = Page({
	data:{},
	template: '<div>图片上传组件</div>',
	props: {
		"multiple":"bool",
		"name":"string",
		"id":"string",
		"src":"array",
		"url":"string",
		"crop":"object",
		"type":"string",
		"class":"string",
		"ratio":"string"
	},

	onReady: function( params ) {
		let $elms = $(params['selector']);
		this.template = $('component[name=uploader-image]').html().toString();
	 	$elms.each( (idx, elm )=>{
	 		this.init( $(elm) );
	 	});
	},


	add: function( src ) {

		let cnt = $('uploader .previews:not(.uk-hidden)').length;
		let $html = $('uploader .previews:last').clone();
			$html.removeClass('uk-hidden');
			$html.find('img').attr('src', src);

		$('uploader .previews:last').after($html);
	},

	init: function( $elm ) {
		let attrs = this.getAttrs( $elm );
			attrs['_html'] = $elm.html();

		let html = Mustache.render(this.template, attrs );
			$elm.html(html);
			$elm.addClass('uploader-inited');
			$elm.find('input[type="file"]').prop('multiple', attrs['multiple']); // 多图上传

			// 固定比例
			if ( attrs['ratio'] != null ){
				let ratio = null;
				try { ratio =  eval(attrs['ratio']) } catch(e){ ratio=null; console.log(attrs['name'], ' ratio error:', attrs['ratio']);};
				if ( typeof ratio == 'number' && ratio != Infinity && ratio > 0 ) {
					let width = $elm.find('.uk-cover-container').width();
					let height = width / ratio;
					$elm.find('.uk-cover-container').height(height);
					console.log( ratio, typeof ratio, width, height );
				}
			}
			

			// 创建预览
			for ( let i in attrs['src'] ) {
				let src = attrs['src'][i];
				if ( src != '' ) {
					this.add(src);
				}
			}

		let $bar = $elm.find('.uk-progress');

		UIkit.upload( $elm.find('.js-upload'), {
			url: attrs['url'],
			multiple: attrs['multiple'],
			beforeSend: function() {
				console.log('beforeSend', arguments);
			},
			loadStart: function(e ){
				
				$bar.removeAttr('hidden');
				$bar.fadeIn('fast');
				$bar.attr('max', e.total);
				$bar.attr('value', e.loaded);

			},
			progress: function (e) {
				console.log('progress',  e.total, e.loaded );
				$bar.attr('max', e.total);
				$bar.attr('value', e.loaded);
			},
			loadEnd: function (e) {
				console.log('loadEnd', arguments);
				$bar.attr('max', e.total);
				$bar.attr('value', e.loaded);
				
			},
			completeAll: function () {
				$bar.fadeOut('fast');
			}
		});
	},

	getAttrs: function( $elm ) {
		let data = {};
		let parseObject = ( value ) => {
			let vals = ( value == null ) ? '' : value.split(';');
			let len = vals.length;
			let vlist = {};
			for (var i=0; i<len; i++ ){
				let v = vals[i];
				let m = (v == null) ? [""] : v.split(':');
				if (  m.length == 2 ) {
					vlist[m[0]] = m[1];
				}
			}
			return vlist;
		}

		$.each( this.props ,( name, type ) => {
			switch( type ){
				case 'string':
					data[name] = $elm.attr(name) || null;
					break;
				case 'bool':
					data[name] = $elm.attr(name) ? true : false;
					break;
				case 'object':
					data[name] = parseObject($elm.attr(name));
					break;
				case 'array':
					let src = $elm.attr(name) || "";
					data[name] = src.split(',');
					break;

				default: 
					data[name] = $elm.attr(name);
			}
		});
		return data;
	}
})

module.exports = com;