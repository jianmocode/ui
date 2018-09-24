let web = getWeb();
let com = Page({
	data:{},
	template: '<div>图片上传组件</div>',
	events: {},
	props: {
		"multiple":"bool",
		"name":"string",
		"id":"string",
		"src":"array",
		"url":"string",
		"crop":"object",
		"type":"string",
		"class":"string",
		"ratio":"string",
		"allow":"string",
		"accept":"string",
		"max":"number",
		"maxChunkSize":"number"
	},

	onReady: function( params ) {
		let $elms = $(params['selector']);
		this.template = $('component[name=uploader-image]').html().toString();
		this.events.change = (typeof params['change'] == 'function' ) ? params['change'] : () => {};
		this.events.error = (typeof params['error'] == 'function' ) ? params['error'] : () => {};

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

	init: function( $elm ) {
		let attrs = this.getAttrs( $elm );
			attrs['_html'] = $elm.html();

		let html = Mustache.render(this.template, attrs );
			$elm.html(html);
			$elm.addClass('uploader-inited'); //标记初始化完毕

			// 设定多图上传
			$elm.find('input[type="file"]').prop('multiple', attrs['multiple']); // 多图上传

			// 设定固定比例
			if ( attrs['ratio'] != null ){
				let ratio = null;
				try { ratio =  eval(attrs['ratio']) } catch(e){ ratio=null; console.log(attrs['name'], ' ratio error:', attrs['ratio']);};
				if ( typeof ratio == 'number' && ratio != Infinity && ratio > 0 ) {
					let width = $elm.find('.uk-cover-container').width();
					let height = width / ratio;
					$elm.find('.uk-cover-container').height(height);
				}
			}

			// 设定预览界面
			for ( let i in attrs['src'] ) {
				let src = attrs['src'][i];
				if ( src != '' ) {
					this.add($elm, src, attrs);
				}
			}

			// 设定添加按钮
		let cnt = $elm.find('.previews:not(.uk-hidden)').length;
			if (cnt >= 1 && !attrs['multiple'] ) {
				this.removeAddBtn($elm);
			}

			// 拖拽事件设定 dragover dragenter drop
			$elm.on( 'dragover', ()=>{
				$elm.find('.jm-uploader-image').addClass('jm-active');
			});
			$elm.on( 'drop dragleave mouseleave', ()=>{
				$elm.find('.jm-uploader-image').removeClass('jm-active');
			});


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

				let $preview = this.add($elm, null, attrs );
				if ( !$preview ){
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

				data['$preview'] = $preview;
				data['$elm'] = $elm;
				$preview.find('.name').removeClass('uk-hidden');
				$preview.find('.name').html(data.files[0].name);
				data.submit();
			},
			progress: (e, data) => {
				// let progress = parseInt(data.loaded / data.total * 100, 10);
				let $p = data.$preview.find('progress');
				$p.attr('max', data.total);
				$p.attr('value', data.loaded);
				// console.log( $p );
			},
			always: (e, data) => {
				this.success( data.$elm, data.$preview, 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537733814589&di=2a8d922ad7fd874cd3fcfecb2b3393ad&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F9e3df8dcd100baa1f3d70e9d4d10b912c8fc2e18.jpg' );
			}
		});

	},

	removeAddBtn: function( $elm ) {
		$elm.find('.btn-upload').addClass('uk-hidden');
	},

	add: function( $elm, src, attrs ) {

		let cnt = $elm.find('.previews:not(.uk-hidden)').length;
			if (cnt >= 1 && !attrs['multiple'] ) {
				return false;
			}

		let $html = $elm.find('.previews:last').clone();
			$html.removeClass('uk-hidden');
			$html.find('img').attr('src', src);

			if ( src == null ) {
				this.loading( $html );
			}

		$elm.find('.previews:last').after($html);
		if (cnt == 0 && !attrs['multiple'] ) {
			this.removeAddBtn( $elm );
		}

		return $html;
	},

	loading: function( $preview ) {
		$preview.removeClass('uk-hidden');
		$preview.find('progress').prop('hidden', false);
		$preview.find('.name').removeClass('uk-hidden');
		$preview.find('.uk-overlay-primary').addClass('uk-hidden');
		this.events.change( this, $preview);
	},

	success: function( $elm, $preview, src ) {
		$preview.find('img').attr('src', src);
		$preview.find('progress').attr('value', 0);
		$preview.find('progress').prop('hidden', true);
		$preview.find('.name').addClass('uk-hidden');
		$preview.find('.uk-overlay-primary').removeClass('uk-hidden');
		$elm.find('.jm-uploader-image').removeClass('jm-error');
		$elm.find('.jm-helper').removeClass('uk-form-danger');
		this.events.change( this, $preview, src );
	},

	error: function( $elm, errors ) {
		$elm.find('.jm-uploader-image').addClass('jm-error');
		for( var i in errors ){
			let error = errors[i];
			$elm.find('.jm-helper').addClass('uk-form-danger');
			$elm.find('.jm-helper').html(error.message);
		}

		try { this.events.error( this, errors, $elm ); } catch(e){
			console.log('Events error call fail', e );
		}
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

				default: 
					data[name] = $elm.attr(name);
			}
		});
		return data;
	}
})

module.exports = com;