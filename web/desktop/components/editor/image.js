let com = Page({
	data:{},
	template: '<div>图片编辑组件</div>',
	events: {},
	cropper: null,
	props: {
		"disabled":"bool",  // 是否 disabled
		"name":"string",	// 名称
		"id":"string",		// ID
		"url":"string",		// 云端通信地址
		"value":"json",		// 数值
		"crop":"object",	// 裁切配置
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

		// 自动按比例裁切
		let aspectRatio = NaN;
		let autoCrop = false;
		let dragMode = 'none';

		if ( attrs['crop']['ratio'] ) {
			autoCrop = true;
			dragMode = 'crop';
			try { eval('aspectRatio='+ attrs['crop']['ratio']); } catch(e) { aspectRatio =NaN; }
		}

		// 固定比例裁切
		if ( aspectRatio ) {
			$elm.find('.croped').remove();
		}

		// 图片对象
		let $img = $elm.find('.origin-image');

		//fix preview bug
		$img.load( ( event) => {
			$img.data('img-width', $img.width());
			$img.data('img-height', $img.height());
		});

		// 载入画布和图像
		$img.cropper({
			dragMode:dragMode,
			aspectRatio: aspectRatio,
			autoCrop:autoCrop, // 自动裁切
			preview: '[name="'+ attrs['name'] +'-preview"]',
			ready: ( event ) => {
				$img.cropper('zoom', -0.1);

				// const containerData = $img.cropper('getContainerData');
				// $img.cropper('zoomTo', containerData.width/ containerData.height, { x: 0,y: 0 });

			},
			crop: function(event) {

				let w = event.detail.width || $img.data('img-width') ;
				let h = event.detail.height || $img.data('img-height') ;
				let ratio = w/h;
				$elm.find('.width-preview').html( w.toFixed(0) );
				$elm.find('.height-preview').html( h.toFixed(0) );
				$elm.find('.ratio-preview').html( ratio.toFixed(2) );
			}
		});

		// 留存原始数据
		$elm.data('origin-value', attrs['value']);

		// 初始化工具条
		this.initToolbar( $elm );

	},

	/**
	 * 初始化工具条
	 * @param  {[type]} $elm [description]
	 * @return 
	 */
	initToolbar: function( $elm ) {
		
		// 裁切
		$elm.find('.crop').click( function( event ) {
			let $elm = $(this).parents('.jm-editor-image');
			let $img = $elm.find('.origin-image');
			$img.cropper('setDragMode', 'crop');
			$elm.find('.croped').removeClass('uk-hidden');
		});

		// 移动
		$elm.find('.move').click( function( event ) {
			let $elm = $(this).parents('.jm-editor-image');
			let $img = $elm.find('.origin-image');
			$img.cropper('setDragMode', 'move');
			$elm.find('.croped').removeClass('uk-hidden');
		});

		// 放大
		$elm.find('.zoomin').click( function( event ) {
			let $elm = $(this).parents('.jm-editor-image');
			let $img = $elm.find('.origin-image');
			$img.cropper('zoom', +0.1);
		});

		// 缩小
		$elm.find('.zoomout').click( function( event ) {
			let $elm = $(this).parents('.jm-editor-image');
			let $img = $elm.find('.origin-image');
			$img.cropper('zoom', -0.1);
		});

		// 设定比例
		$elm.find('.aspectratio').click( function( event ) {
			let $elm = $(this).parents('.jm-editor-image');
			let $img = $elm.find('.origin-image');
			let ratiostr = $(this).attr('data-value');
			let ratio = NaN;
			try { eval('ratio='+ratiostr); } catch(e) { ratio =NaN; }
			$img.cropper('setAspectRatio', ratio);
			
		});

		// 重置
		$elm.find('.reset').click( () => {
			this.reset( $elm);
		});

		// 保存
		$elm.find('.save').click(()=>{
			this.save( $elm );
		});
	},

	/**
	 * 恢复到初始化的状态
	 * @param  {[type]} $elm [description]
	 * @return {[type]}      [description]
	 */
	reset: function( $elm ){


		let $img = $elm.find('.origin-image');
		let val = $elm.data('origin-value') || {};
		
		// Reset 控件
		$img.cropper('reset');
		$img.cropper('zoom', -0.1);

		// Reset value
		$elm.find('[name=title]').val( val.title  || '' );
		$elm.find('[name=link]').val( val.link  || '' );
		$elm.find('[name=summary]').val( val.summary  || '' );
		$elm.attr('value', JSON.stringify( val ) );

		// 隐藏提醒窗体
		$elm.find('.reset-drop').each((idx,el)=>{
			UIkit.drop($(el)).hide();
		})

	},


	/**
	 * 保存
	 * @return {[type]} [description]
	 */
	save: function( $elm, url=null) {

		let $img = $elm.find('.origin-image');
		let attrs = this.getAttrs( $elm );
		let value = attrs['value'];
		url =  url ? url : attrs['url'];

		value['title'] = $elm.find('[name=title]').val() || "";
		value['link'] = $elm.find('[name=link]').val() || "";
		value['summary'] = $elm.find('[name=summary]').val() || "";
		$elm.attr('value', JSON.stringify( value ) );

		let croped = $img.cropper('getData');
		if ( url ) {
			this.lock( $elm );
			$.post(url, {'crop':JSON.stringify(croped), 'value':$elm.attr('value')}, ( data ,status, xhr)=>{
				this.unlock( $elm );

				if( typeof data['code'] != 'undefined'  && data['code'] != 0 ){
					this.error( $elm, data, xhr );
					return;
				}

				this.success( $elm, data, xhr );

			}, 'json');
		}
	},


	/**
	 * 错误通报
	 * @param  {[type]} $elm [description]
	 * @return {[type]}      [description]
	 */
	error: function ( $elm, data, xhr ) {
		try { this.events.error( this, data, $elm ); } catch(e){	console.log('Events error call fail', e );}
	},


	/**
	 * 成功返回
	 * @param  {[type]} $elm [description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} xhr  [description]
	 * @return {[type]}      [description]
	 */
	success: function ( $elm, data, xhr ) {

		if ( typeof data['value'] != 'undefined') {
			$elm.attr('value', JSON.stringify( data['value'] ) );
		}

		try { this.events.success( this, data, $elm ); } catch(e){	console.log('Events success call fail', e );}
	},


	/**
	 * 锁定操作界面
	 * @param  {[type]} $elm [description]
	 * @return {[type]}      [description]
	 */
	lock: function( $elm ) {

		$elm.find('a').addClass('uk-disabled');
		$elm.find('a').prop('disabled', true);

		$elm.find('input').addClass('uk-disabled');
		$elm.find('input').prop('disabled', true);

		$elm.find('textarea').addClass('uk-disabled');
		$elm.find('textarea').prop('disabled', true);

		$elm.find('button').addClass('uk-disabled');
		$elm.find('button').prop('disabled', true);

	},


	/**
	 * 解锁操作界面
	 * @param  {[type]} $elm [description]
	 * @return {[type]}      [description]
	 */
	unlock: function( $elm ){

		$elm.find('a').removeClass('uk-disabled');
		$elm.find('a').prop('disabled', false);

		$elm.find('input').removeClass('uk-disabled');
		$elm.find('input').prop('disabled', false);

		$elm.find('textarea').removeClass('uk-disabled');
		$elm.find('textarea').prop('disabled', false);

		$elm.find('button').removeClass('uk-disabled');
		$elm.find('button').prop('disabled', false);
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