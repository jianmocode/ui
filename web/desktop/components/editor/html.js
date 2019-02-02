let com = Page({
    _name:'HtmlEditor',
	data:{},
	template: '<textarea>HTML文本编辑器</textarea>',
	events: {},
	props: {
		"disabled":"bool",  // 是否 disabled
        "name":"string",	// 名称
        "lang": 'string',   // 语言
		"id":"string",		// ID
		"url":"string",		// 云端通信地址
        "validate":"string",	// 数据验证
        "placeholder":"string",	// placeholder
		"tooltip":"function"		// 工具
    },
    onReady: function( params ) {

		let $elms = $(params['selector']);
		this.template = $('component[name=editor-html]').html().toString();
		this.events.change = (typeof params['change'] == 'function' ) ? params['change'] : () => {};
		this.events.error = (typeof params['error'] == 'function' ) ? params['error'] : () => {};
		this.events.success = (typeof params['success'] == 'function' ) ? params['success'] : () => {};
	 	$elms.each( (idx, elm )=>{
	 		this.init( $(elm) );
        });

        // 添加 图片、视频和附件按钮
        // @see https://gist.github.com/pmhoudry/a0dc6905872a41a316135d42a5537ddb
        addEventListener("trix-initialize", (event) => {      
            this.addNewBlock( event.target ); // 添加个性化面板
            this.addImage( event.target ); // 添加图片
            this.addVideo( event.target ); // 添加视频
            this.addAttach( event.target ); // 添加附件
        });
    },

    // 添加个性化面板
    addNewBlock: function ( trix ) {
        let toolBar = trix.toolbarElement;
        let spacer = toolBar.querySelector(".trix-button-group-spacer");
        let blockElm = document.createElement("span");
            blockElm.setAttribute("class","trix-button-group trix-button-group--block-tools trix-button-group-custom");
            blockElm.setAttribute("data-trix-button-group", "block-tools");

        if ( spacer ) {
            spacer.before(blockElm);
        }
    },

    // 添加附件 
    addAttach:function( trix ) {

        let button = document.createElement("button");
            button.setAttribute("data-trix-action", "x-attach");
            button.setAttribute("class", "trix-button trix-button--icon trix-button--icon-attach");
            button.setAttribute("type", "button");

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-custom");
        let attachBtn = blockElm.appendChild(button);

        // 上传按钮点击, 选择文件并上传
        attachBtn.addEventListener("click", ()=>{
            console.log('选择文件并上传');
        });
    },

    // 添加图片
    addImage:function( trix ) {

        let button = document.createElement("button");
            button.setAttribute("data-trix-action", "x-image");
            button.setAttribute("class", "trix-button trix-button--icon trix-button--icon-image");
            button.setAttribute("type", "button");

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-custom");
        let imageBtn = blockElm.appendChild(button);

        // 上传按钮点击, 选择文件并上传
        imageBtn.addEventListener("click", ()=>{
            console.log('选择图片并上传');
        });
    },

    // 添加视频
    addVideo:function( trix ) {

        let button = document.createElement("button");
            button.setAttribute("data-trix-action", "x-image");
            button.setAttribute("class", "trix-button trix-button--icon trix-button--icon-video");
            button.setAttribute("type", "button");

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-custom");
        let videoBtn = blockElm.appendChild(button);

        // 上传按钮点击, 选择文件并上传
        videoBtn.addEventListener("click", ()=>{
            console.log('选择视频并上传');
        });
    },

    
    init: function( $elm ) {
        let attrs = this.getAttrs( $elm );
            attrs["lang"] = attrs["lang"] ?  attrs["lang"] : 'zh-CN';
        
        let value = $elm.html();
        let data = Object.assign({},attrs);
            data["value"] = value;
        

        let html = Mustache.render(this.template, data );
        $elm.html(html);
        $elm.addClass('editor-inited'); //标记初始化完毕

        // Init trix
        $('.jm-editor-html',$elm).append(`<trix-editor class="jm-article" input="${attrs.name}_input"></trix-editor>`);
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
                case 'function':
                    data[name] = $elm.attr(name) ?  eval($elm.attr(name)) : function(){};
                    break;
				default: 
					data[name] = $elm.attr(name);
			}
		});
		return data;
	}
});

module.exports = com;