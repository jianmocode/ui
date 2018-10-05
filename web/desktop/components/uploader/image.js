let com = Page({
	_name:'ImageUploader',
	data:{},
	template: '<div>图片上传组件</div>',
	events: {},
	props: {
		"multiple":"bool",	 // 是否支持上传多张图片
		"disabled":"bool",  // 是否 disabled
		"name":"string",	// 名称
		"id":"string",		// ID
		"url":"string",		// 上传API云端地址
		"crop":"object",	// 裁切配置
		"type":"string",	// 类型 
		"class":"string",	// 特别类型
		"ratio":"string",	// 图片比例 eg: 16/9  auto 
		"allow":"string",	// 文件类型校验正则 /(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i
		"accept":"string",  // 许可文件类型 .jpg,.png 
		"max":"number",  // 文件最大值, 默认 2G 
		"maxChunkSize":"number", // 分段上传每次上传最大字节单位: kb
		"value":"json",	 // 数值
		"thumb":"string",  // 缩略图字段, 默认为 url
		"title":"string",  // 标题字段，默认为 title
		"titleClass":"string", //标题栏样式
		"titleStyle":"string"  //标题栏样式
	},

	onReady: function( params ) {
		let $elms = $(params['selector']);
		this.template = $('component[name=uploader-image]').html().toString();
		this.events.add = (typeof params['add'] == 'function' ) ? params['add'] : () => {};
		this.events.beforeupload = (typeof params['beforeupload'] == 'function' ) ? params['beforeupload'] : () => {};
		this.events.uploaded = (typeof params['uploaded'] == 'function' ) ? params['uploaded'] : () => {};
		this.events.error = (typeof params['error'] == 'function' ) ? params['error'] : () => {};
		this.events.change = (typeof params['change'] == 'function' ) ? params['change'] : () => {};

		this.events.success = (typeof params['success'] == 'function' ) ? params['success'] : () => {};

	 	$elms.each( (idx, elm )=>{
	 		this.init( $(elm) );
	 	});

	 	$(document).on('dragover',()=>{
	 		$('.jm-uploader-image').addClass('jm-prepare');
	 	});

	 	$(document).on('drop dragleave mouseleave keyup',()=>{
	 		$('.jm-uploader-image').removeClass('jm-prepare');
	 	});

	 	$(document).on('keydown', (e)=>{
	 		var keyCode = e.keyCode;
	 		if ( keyCode==91 || keyCode == 17) {
	 			$('.jm-uploader-image').addClass('jm-prepare');
	 		}
	 	});
	},


	initValue: function( $elm, value, attrs ) {
		if ( !$.isArray(value) ) {
			value = [value];
		}
		for (let i in value) {
			if ( value != "" && value != null ) {
				let v = value[i];
				this.add( $elm, v, attrs );
			}
		}
	},

	setValue: function( $item, value, attrs ) {

		let thumbField = attrs['thumb'] ? attrs['thumb'] : 'url';
		let titleField = attrs['title'] ? attrs['title'] : 'title';
		let thumb = ( typeof value == 'object' && value != null ) ? value[thumbField] : value;
		let title = ( typeof value == 'object' && value != null ) ? value[titleField] : "";
		$item.find('img').attr('src', thumb);
		(title !="") ? $item.find('.title').removeClass('uk-hidden').html(title) : $item.find('.title').addClass('uk-hidden');
		$item.data('value', value);

		// 更新数据
		let $elm = $item.parents('uploader');
		this.updateValue($elm, attrs['multiple']);

	},

	updateValue: function( $elm, multiple ) {

		let values = [];
		$elm.find('.item:not(.uk-hidden)').each((index, it)=>{
			values.push($(it).data('value'));
		});

		if ( !multiple ){
			$elm.find('input[type=hidden]').val(JSON.stringify(values[0]) );
			return true;
		}
		$elm.find('input[type=hidden]').val(JSON.stringify(values) );
		return true;
	},


	setAttrs: function( $elm, attrs ) {

		// 设定多图上传
		$elm.find('input[type="file"]').prop('multiple', attrs['multiple']); // 多图上传

		if ( attrs['ratio'] != null  && attrs['ratio'] != 'auto' ){
			let ratio = null;
			try { ratio =  eval(attrs['ratio']) } catch(e){ ratio=null; console.log(attrs['name'], ' ratio error:', attrs['ratio']);};
			this.setRatio( $elm.find('.item'), ratio);
		}

		// 初始化数值
		this.initValue( $elm, attrs['value'], attrs );

		// 设定添加按钮
		let cnt = $elm.find('.item:not(.uk-hidden)').length;
			if (cnt >= 1 && !attrs['multiple'] ) {
				this.hideUploadBtn($elm);
			}

		// disabled
		if ( attrs['disabled'] ) {
			this.disabled( $elm );
		}

		// 允许文件类型
		let acceptFileTypes = /^.*$/i;
		if (  attrs['allow'] ) {
			try { acceptFileTypes = eval(attrs['allow']); } catch(e){
				console.log('allow does not correct', e);
			}

			if (typeof acceptFileTypes.test != 'function' ){
				acceptFileTypes = /^.*$/i;
			}
		}

		// 允许文件大小
		let maxFileSize = attrs['max'] ? attrs['max'] * 1024 : 2147483648; // 2GB

		// 初始化 upload 控件
		// @see https://github.com/blueimp/jQuery-File-Upload/wiki/Options
		$elm.find('input[type=file]').fileupload({
			dropZone: $elm,
			pasteZone: $elm,
			url: attrs['url'] ?  attrs['url'] : $elm.parent('form').attr('action'),
			maxChunkSize:attrs['maxChunkSize'] ? attrs['maxChunkSize'] : undefined,
			recalculateProgress:false,
			add: (e, data) => {

				// disabled
				if ($elm.prop('disabled') ) {
					this.disabled( $elm );
					return;
				}

				let errors = [];

				// 校验filetype
				if(data.originalFiles[0]['type'].length && 
					(!acceptFileTypes.test(data.originalFiles[0]['type']) && !acceptFileTypes.test(data.originalFiles[0]['name']))
				) {
					errors.push({
						code:403,
						message: '文件类型不允许上传',
						extra: {
							filename: data.originalFiles[0]['name'],
							filetype: data.originalFiles[0]['type'],
							acceptFileTypes: acceptFileTypes,
							accept: attrs['accept']
						}
					});
				}

				if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > maxFileSize ) {
					errors.push({
						code:403,
						message: '文件大小不能超过' + (maxFileSize/1024/1024) + 'M',
						extra: {
							maxFileSize: maxFileSize,
							filesize: data.originalFiles[0]['size'],
							filename: data.originalFiles[0]['name'],
							filetype: data.originalFiles[0]['type']
						}
					});
				}

				if ( errors.length > 0 ){
					this.error( $elm, errors );
					return ;
				}

				let $item = this.add($elm, null, attrs, true ); // 添加 item
				if ( !$item ){
					errors.push({
						code:402,
						message: '添加失败, 每次最多添加一个文件',
						extra: {
							maxFileSize: maxFileSize,
							filesize: data.originalFiles[0]['size'],
							filename: data.originalFiles[0]['name'],
							filetype: data.originalFiles[0]['type']
						}
					});

					this.error( $elm, errors );
					return;
				}

				data['$item'] = $item;
				$item.find('.name').removeClass('uk-hidden');
				$item.find('.name').html(data.files[0].name);
				data.submit();
			},
			progress: (e, data) => {
				// let progress = parseInt(data.loaded / data.total * 100, 10);
				let $p = data.$item.find('progress');
				$p.attr('max', data.total);
				$p.attr('value', data.loaded);
				// console.log( $p );
			},
			always: (e, data) => {
				let value  = {
					title: "新创建的",
					url:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537733814589&di=2a8d922ad7fd874cd3fcfecb2b3393ad&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F9e3df8dcd100baa1f3d70e9d4d10b912c8fc2e18.jpg'
				};
				this.success( data.$item, value, attrs );
			}
		});


		// 初始化排序控件
		UIkit.util.on($elm, 'moved', (event)=>{
			this.updateValue($elm, attrs['multiple']);
		});
	},


	init: function( $elm ) {

		let attrs = this.getAttrs( $elm );
			attrs['_html'] = $elm.html();

			// 默认值
			if ( attrs['titleClass'] == '' || attrs['titleClass'] == null ) {
				attrs['titleClass'] = 'uk-overlay-default uk-position-bottom';
			}


		let html = Mustache.render(this.template, attrs );
			$elm.html(html);
			$elm.addClass('uploader-inited'); //标记初始化完毕
		
		// 设定参数
		this.setAttrs( $elm, attrs );

		// 拖拽事件设定 dragover dragenter drop
		$elm.on( 'dragover', ()=>{
			$elm.find('.jm-uploader-image').addClass('jm-active');
		});
		$elm.on( 'drop dragleave mouseleave', ()=>{
			$elm.find('.jm-uploader-image').removeClass('jm-active');
		});
	},

	reset: function( $elm ){
		$elm.html('');
	},

	bindItemEvents: function( $item, attrs ) {

		// 删除时候触发
		$item.find('.btn-remove').click((event)=>{
			this.remove($item, attrs);
		});

		// ratio auto
		if ( attrs['ratio'] == 'auto' ) {
			$item.find('img').load( (img)=>{
				let w = $(event.currentTarget).width();
				let h = $(event.currentTarget).height();
				let ratio = w/h;
				this.setRatio($item, ratio);
			});
		}
	},

	setRatio: function( $item, ratio ) {
		if ( typeof ratio == 'number' && ratio != Infinity && ratio > 0 ) {
			let width = $item.find('.uk-cover-container').width();
			let height = width / ratio;
			$item.height(height);
			$item.find('.uk-cover-container').height(height);
		}
	},

	hideUploadBtn: function( $elm ) {
		$elm.find('.btn-upload').addClass('uk-hidden');
	},

	showUploadBtn: function( $elm) {
		$elm.find('.btn-upload').removeClass('uk-hidden');
	},

	disabled: function( $elm ) {
		$elm.find('.jm-uploader-image').addClass('jm-disabled');
		$elm.find('input[type=file]').prop('disabled', true);
		$elm.find('.item').addClass('uk-disabled');
	},

	enabled: function( $elm ){
		$elm.find('.jm-uploader-image').removeClass('jm-disabled');
		$elm.find('input[type=file]').prop('disabled', false);
		$elm.find('.item').removeClass('uk-disabled');
	},

	add: function( $elm, value, attrs, empty=false ) {

		let cnt = $elm.find('.item:not(.uk-hidden)').length;
			if (cnt >= 1 && !attrs['multiple'] ) {
				return false;
			}

		let $item = $elm.find('.item:last').clone();
			$item.removeClass('uk-hidden');
			if ( empty ) {
				this.loading( $item );
			}

		$elm.find('.item:last').after($item);
		if (cnt == 0 && !attrs['multiple'] ) {
			this.hideUploadBtn( $elm );
		}

		this.bindItemEvents( $item, attrs );
		this.setValue($item, value, attrs);
		return $item;
	},

	remove: function( $item, attrs) {

		// 记录删除的 $item (表单提交时候一起提交)
		let $elm = $item.parents('uploader');
		let cnt = $elm.find('.item:not(.uk-hidden)').length;
		if (cnt == 1  && !attrs['multiple'] ) {
			this.showUploadBtn( $elm );
		}

		$item.remove();

		// 更新数值
		this.updateValue( $elm, attrs['multiple']);
	},

	loading: function( $item ) {
		$item.removeClass('uk-hidden');
		$item.find('progress').prop('hidden', false);
		$item.find('.name').removeClass('uk-hidden');
		$item.find('.uk-overlay-primary').addClass('uk-hidden');
		try { this.events.change( this, $item, null); } catch(e){	console.log('Events change call fail', e );}
	},

	success: function( $item, value, attrs ) {
		let $elm = $item.parents('uploader');
		this.setValue($item, value, attrs);

		$item.find('progress').attr('value', 0);
		$item.find('progress').prop('hidden', true);
		$item.find('.name').addClass('uk-hidden');
		$item.find('.uk-overlay-primary').removeClass('uk-hidden');
		$elm.find('.jm-uploader-image').removeClass('jm-error');
		$elm.find('.jm-helper').removeClass('uk-form-danger');
		try { this.events.success( this, $elm, $item, value ); } catch(e){	console.log('Events success call fail', e );}
		try { this.events.change( this, $item, value); } catch(e){	console.log('Events change call fail', e );}
	},

	error: function( $elm, errors ) {
		$elm.find('.jm-uploader-image').addClass('jm-error');
		for( var i in errors ){
			let error = errors[i];
			$elm.find('.jm-helper').addClass('uk-form-danger');
			$elm.find('.jm-helper').html(error.message);
		}
		try { this.events.error( this, errors, $elm ); } catch(e){	console.log('Events error call fail', e );}
		try { this.events.change( this, $elm, null); } catch(e){	console.log('Events change call fail', e );}
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
})

module.exports = com;