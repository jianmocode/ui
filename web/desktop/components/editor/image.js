let com = Page({
	data:{},
	template: '<div>图片编辑组件</div>',
	events: {},
	props: {
		"disabled":"bool",  // 是否 disabled
		"name":"string",	// 名称
		"id":"string",		// ID
		"url":"string",		// 云端通信地址
		"value":"json",		// 数值
		"tools":"array"		// 工具
	},
	onReady: function( params ) {
		let $elms = $(params['selector']);
		this.template = $('component[name=editor-image]').html().toString();
		this.events.change = (typeof params['change'] == 'function' ) ? params['change'] : () => {};
		this.events.error = (typeof params['error'] == 'function' ) ? params['error'] : () => {};
		this.events.success = (typeof params['success'] == 'function' ) ? params['success'] : () => {};

	 	$elms.each( (idx, elm )=>{
	 		this.init( $(elm) );
	 	});
	},

	init: function( $elm ) {
		let attrs = this.getAttrs( $elm );
		let html = Mustache.render(this.template, attrs );
			$elm.html(html);
			$elm.addClass('editor-inited'); //标记初始化完毕
		this.setAttrs($elm, attrs);


		// 载入画布和图像
		let value = attrs['value'];
		let canvasOffsetWidth = $elm.find('.image-canvas').outerWidth() - $elm.find('.image-canvas').width();
		let canvasOffsetHeight = $elm.find('.image-canvas').outerHeight() -$elm.find('.image-canvas').height();
		let canvasMaxHeight = $elm.height() - $elm.find('.toolbar').outerHeight();
		let imageMaxHeight = canvasMaxHeight - canvasOffsetHeight;
		let imageMaxWidth = $elm.width() - canvasOffsetWidth;
		$elm.find('.image-canvas').height(imageMaxHeight).width(imageMaxWidth);
		var imageEditor = new tui.ImageEditor( $elm.find('.image-canvas'), {
			cssMaxWidth: imageMaxWidth, // Component default value: 1000
			cssMaxHeight:imageMaxHeight // Component default value: 800
		});
		imageEditor.loadImageFromURL(value.url, value.title);


		// 设定工具栏
		$elm.find('.menu-item.cropper').click(()=>{
			imageEditor.startDrawingMode('CROPPER');
		});
	},

	setAttrs: function( $elm, attrs ){
		// console.log( attrs );
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
				case 'number':
					data[name] = $elm.attr(name) ? parseInt($elm.attr(name)) : null;
					break;
				case 'json':
					let json = null;
					if ( $elm.attr(name) ) {
						try { json=JSON.parse($elm.attr(name)) }catch(e){
							console.log('json parser error:', $elm.attr('name'), name, $elm.attr(name), e);
						}
					}
					data[name] = json;
					data[ '__json__' + name ] = $elm.attr(name); // 留存原始数据
					break;
				default: 
					data[name] = $elm.attr(name);
			}
		});
		return data;
	}
});

module.exports = com;