let com = Page({
    _name:'HtmlEditor',
	data:{},
	template: '<textarea>HTML文本编辑器</textarea>',
	events: {},
	props: {
        "disabled":"bool",  // 是否 disabled
        "autofocus":"bool",  // 是否 自动聚焦
        "fetch-image":"bool", // 是否抓取图片地址
        "name":"string",	// 名称
        "lang": 'string',   // 语言
		"id":"string",		// ID
		"url":"string",		// 云端通信地址
        "validate":"string",	// 数据验证
        "placeholder":"string",	// placeholder
        "tooltip":"function",		// 工具
        "toolbar-sticky":"object"  // 工具栏是否置顶 ( "top:xx" ) 
    },

    // 组件初始化
    onReady: function( params ) {

        // + 属性
        Trix.config.textAttributes.color = {
            styleProperty:"color",
            inheritable: true,
            parser: function(element, v ) {
                element.style.color !== "";
            }
        }

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
            
            // 文字属性面板
            this.addNewBlock( event.target, "text");
            this.addColor( event.target );

            // 附件上传面板
            this.addNewBlock( event.target, "custom" ); // 添加个性化面板
            this.addAttach( event.target ); // 添加附件
            // this.addImage( event.target ); // 添加图片
            // this.addVideo( event.target ); // 添加视频
        });
    },
    

    // 初始化
    init: function( $elm ) {
        let attrs = this.getAttrs( $elm );
            attrs["lang"] = attrs["lang"] ?  attrs["lang"] : 'zh-CN';
            attrs["url"] = attrs["url"] ? attrs["url"] : '';
        
        let value = $elm.html();
        let data = Object.assign({},attrs);
            data["value"] = value;
        
        let html = Mustache.render(this.template, data );
        $elm.html(html);
        $elm.addClass('editor-inited'); //标记初始化完毕
    
        // Init trix
        $('.jm-editor-html',$elm).append(`
            <trix-editor 
                placeholder=${attrs.placeholder}
                class="jm-article" 
                ${attrs.autofocus ? "autofocus=true" : ""}
                input="${attrs.name}_input">
            </trix-editor>`
        );

        
        var elm = $('.jm-editor-html',$elm).get(0);
        if ( elm ) {

            // 处理文件上传
            elm.addEventListener("trix-attachment-add", (event) => {
                this.bindFileUploadHandler( event.target, event.attachment, attrs );
            });

            // 工具栏置顶
            if( attrs["toolbar-sticky"] ) {
                this.toolbarSticky( elm.querySelector("trix-editor"), attrs["toolbar-sticky"] );
            }
        }
    },

    // 工具栏置顶
    toolbarSticky( trix, option ) {

        option["top"] =  parseInt(option["top"]) || 0;
        var rect = trix.toolbarElement.getBoundingClientRect();
        var top = rect.top || 0;
        var style = getComputedStyle(trix.toolbarElement);
        var editorStyle = getComputedStyle(trix.editor.element);
        var width = style.width || "100%";
        var paddingTop = parseInt(editorStyle.paddingTop);
        var height = parseInt(style.height) || "auto";

        if ( top < 0 ) {
            top = 0;
        }

        let getScroll = function() {
            if (window.pageYOffset != undefined) {
                return [pageXOffset, pageYOffset];
            } else {
                var sx, sy, d = document,
                    r = d.documentElement,
                    b = d.body;
                sx = r.scrollLeft || b.scrollLeft || 0;
                sy = r.scrollTop || b.scrollTop || 0;
                return [sx, sy];
            }
        }

        let setPos = function () {
            let p = getScroll();
            let offset = top - p[1];
            if ( option["top"] > offset ) {
                trix.toolbarElement.style.top = option["top"] + 'px';
                trix.toolbarElement.style.width = width;
                trix.toolbarElement.style.position = "fixed";
                trix.toolbarElement.style.zIndex = 960;
                trix.editor.element.style.paddingTop = (height + paddingTop) + 'px';
            } else {
                trix.toolbarElement.style.position = "static";
                trix.editor.element.style.paddingTop = paddingTop + 'px';
            }

            // console.log( option["top"] , ">", offset, top , "-", p[1] );
        }

        // 设定当前进度条
        setPos();

        // 监听滚动事件
        window.addEventListener('scroll', (event) => {
            setPos();
        });

    },
    
    // 处理文件上传
    bindFileUploadHandler( trix, attachment, attrs ) {
        let url = attrs["url"] || "";
        if ( url == null || url == "" ) {
            console.log('未指定文件上传云端服务地址(上传文件功能将无法使用)', " trix-id=", trix.getAttribute("trix-id"), attachment );
            return;
        }

        // 上传文件
        uploadAttachment( (progress)=>{attachment.setUploadProgress(progress)} );

        /**
         * 上传文件 ( 下一版应该支持分段上传 )
         */
        function uploadAttachment( progressCallback, successCallback, failureCallback) {
            
            progressCallback = progressCallback ||(() => {});
            successCallback = successCallback ||(() => {});
            failureCallback = failureCallback ||(() => {});

            // 复制过图片等
            if ( !attachment.file ) {   
                fetchUrl(progressCallback, successCallback, failureCallback);
                return;
            }

            sendFile(progressCallback, successCallback, failureCallback);
        }
        

        /**
         * 分段上传文件
         * @param {*} progressCallback 
         * @param {*} successCallback 
         * @param {*} failureCallback 
         */
        function sendFile( progressCallback, successCallback, failureCallback ) {

            let file = attachment.file;
            // Check File

            var key = createStorageKey(file)
            var formData = createFormData(key, file)
            var xhr = new XMLHttpRequest()
        
            xhr.open("POST", url, true)
        
            xhr.upload.addEventListener("progress", function(event) {
                var progress = event.loaded / event.total * 100
                progressCallback(progress)
            })
        
            xhr.addEventListener("load", function(event) {
                let response = {};
                try {
                    response = JSON.parse( xhr.responseText );
                }catch( e ){
                    console.log('upload error', e);
                    attachment.remove();
                    failureCallback( {code:500, message:e.message, extra:{ error: e}} );
                    return;
                }

                // 上传失败
                if ( response.code != 0 || typeof response.data != "object" ) {
                    let message = response.message || "上传失败";
                    attachment.remove();
                    console.log( message );
                    failureCallback( response );
                    return;
                }


                let data = response.data || {};
                setContent(data);
                successCallback(data);
            })
        
            xhr.send(formData);
        }

        /**
         * 通过网址抓取附件
         * @param {*} progressCallback 
         * @param {*} successCallback 
         * @param {*} failureCallback 
         */
        function fetchUrl( progressCallback, successCallback, failureCallback  ) {

            let values = {};
            try {
                values = attachment.attachment.attributes.values;
            }catch(e) { 
                failureCallback({code:500, message:e.message, extra:{ e: e}});
                return;
            }

            let type = values["contentType"];
            if ( type != "image" ) {
                // 忽略其他附件格式
                return;
            }

            // 是否抓取网络图片( 下一版实现 )
            // if ( !attrs["fetch-image"] ) {
            if ( true ) {
                attachment.file = {
                    name:new Date().getTime() + ".png"
                };
                let data ={
                    mime: "image/png",
                    url: values["url"],
                    origin:values["url"]
                };
                setContent( data );
                successCallback(data);
                return;
            }

        }

        /**
         * 设定附件内容预览
         * @param {*} data 
         */
        function setContent( data ) {

            let file = attachment.file;
            let attributes ={
                previewable: false,
                url: data.url,
                href: data.url
            };

            if (!data.mime ){ 
                data.mime = "application/file";
            }
           
            if ( data.mime.includes("image") ) { // 图片
                attributes["content"] = `
                    <span class="trix-preview-image" data-url="${data.url}"  data-name="${file.name}" >
                        <img src="${data.url}" /> 
                    <span>
                `;

            } else if ( data.mime.includes("video") ) { // 视频
                attributes["content"] = `
                    <span class="trix-preview-video"  data-url="${data.url}"  data-name="${file.name}" >
                        <video width="100%" height="auto" controls>
                            <source src="${data.url}" type="${data.mime}">
                        </video>
                    <span>
                `;

            } else {
                attributes["content"] = `
                    <span class="trix-preview-file" data-url="${data.url}"  data-name="${file.name}" >
                        ${file.name}
                    <span>
                `;
            }

            attachment.setAttributes(attributes);
        }   


        function createStorageKey(file) {
            var date = new Date()
            var day = date.toISOString().slice(0,10)
            var name = date.getTime() + "-" + file.name
            return [ "tmp", day, name ].join("/")
        }

        function createFormData(key, file) {
            var data = new FormData()
            data.append("key", key)
            data.append("file", file)
            data.append("Content-Type", file.type)
            return data
        }
    },


    
    // 添加个性化面板
    addNewBlock: function ( trix, name ) {
        name = name || "custom";
        let toolBar = trix.toolbarElement;
        let spacer = toolBar.querySelector(".trix-button-group-spacer");
        let blockElm = document.createElement("span");
            blockElm.setAttribute("class",`trix-button-group trix-button-group--block-tools trix-button-group-${name}`);
            blockElm.setAttribute("data-trix-button-group", "block-tools");

        if ( spacer ) {
            spacer.before(blockElm);
        }
    },


    // 添加文字属性 ( 颜色, 字号等 )
    addColor: function( trix ) {

        // 色板
        let colors = {
            standard: ["#717071", "#c9c9c9", "#fe8b7b", "#fec470", "#7ed6a6", "#5dc9e8", "#c793e7"],
            theme:[
                "#333333", "#808080", "#d14b3a", "#d39236", "#45ab73", "#239dc1", "#8f54b5",
                "#717071", "#c9c9c9", "#fe8b7b", "#fec470", "#7ed6a6", "#5dc9e8", "#c793e7",
                "#b5b5b5", "#e3e3e3", "#fec3ba", "#fee0b4", "#bcead0", "#abe3f3", "#e1c7f2"
            ]
        };

        function getColorItem( colors ) {
            let colorItem = '';
            for( var i in colors ) {
                let c = colors[i];
                colorItem += `
                    <li>
                        <a  
                            href="javascript:void(0);"
                            onclick="
                                var dialog = this.parentElement.parentElement.parentElement.parentElement;
                                var color = dialog.querySelector('[name=\\'color\\']');
                                    color.value='${c}';
                            "
                            class="trix-dialog-color-item" 
                            data-trix-method="setAttribute" 
                        >
                            <span class="trix-dialog-color" style="background-color:${c}"></span>
                        </a>
                    </li>
                `;
            }
            return colorItem;
        }
        
        let standardColorItem = getColorItem(colors.standard);  // 标准色 
        let themeColorItem = getColorItem(colors.theme);;  // 主题色

        let trixId = trix.trixId;
        let buttonContent = `
            <button type="button" 
                class="trix-button trix-button--icon trix-button--icon-color" 
                data-trix-attribute="color" 
                data-trix-key="+" title="颜色" tabindex="-1"></button>
        `;
        
        let dialogContent = `
            <div class="trix-dialog trix-dialog--color" data-trix-dialog="color" data-trix-dialog-attribute="color"  >
                <input 
                    type="hidden" name="color" 
                    onchange="
                        console.log('change:', this.value );
                    "
                    data-trix-input required >

                <div class="trix-dialog-color-group">
                    <a href="javascript:void(0);"  
                        data-trix-method="removeAttribute" 
                        class="trix-dialog-color-block">
                        <span class="trix-dialog-color trix-dialog-color--default"></span>
                        自动
                    </a>
                </div>

                <div class="trix-dialog-color-group">
                    <div class="trix-dialog-color-group-title">
                        标准色
                    </div>
                    <ul>
                        ${standardColorItem}
                    </ul>
                </div>

                <div class="trix-dialog-color-group">
                    <div class="trix-dialog-color-group-title">
                        主题色
                    </div>
                    <ul>
                        ${themeColorItem}
                    </ul>
                </div>

                <div class="trix-dialog__attach-fields" style="display:none">
                    <div class="trix-button-group">
                        <input type="button" class="trix-button trix-button--dialog" value="设置颜色"  data-trix-method="setAttribute"  >
                        <input type="button" class="trix-button trix-button--dialog" value="清除颜色"  data-trix-method="removeAttribute"   style="border-left:none"> 
                    </div>
                </div>
            </div>
        `;

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-text");
        var dialogElm = toolBar.querySelector(".trix-dialogs");
        blockElm.insertAdjacentHTML("beforeend", buttonContent);
        dialogElm.insertAdjacentHTML("beforeend", dialogContent);
    },

    // 添加附件 
    addAttach:function( trix ) {

        let trixId = trix.trixId;

        let buttonContent = `
            <button type="button" 
                class="trix-button trix-button--icon trix-button--icon-attach" 
                data-trix-attribute="attach" 
                data-trix-key="+" title="附件" tabindex="-1"></button>
        `;
        
        let dialogContent = `
            <div class="trix-dialog trix-dialog--attach" data-trix-dialog="attach" data-trix-dialog-attribute="attach"  >
                <div class="trix-dialog__attach-fields">
                    <input type="file" class="trix-input trix-input--dialog" >
                    <div class="trix-button-group">
                        <input type="button" class="trix-button trix-button--dialog" 
                            onclick="
                                var trix = document.querySelector('trix-editor[trix-id=\\'${trixId}\\']');
                                var fileElm = this.parentElement.parentElement.querySelector('input[type=\\'file\\']');
                                if ( fileElm.files.length == 0 ) { 
                                    console.log('nothing selected');
                                    return;
                                }
                                var file = fileElm.files[0];
                                trix.editor.insertFile(file);
                            ";
                            value="插入附件" data-trix-method="removeAttribute"
                        >
                        <input type="button" class="trix-button trix-button--dialog" value="取消操作" data-trix-method="removeAttribute">
                    </div>
                </div> 
            </div>
        `;

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-custom");
        var dialogElm = toolBar.querySelector(".trix-dialogs");

        blockElm.insertAdjacentHTML("beforeend", buttonContent);
        dialogElm.insertAdjacentHTML("beforeend", dialogContent);
    },

    // 添加图片 (下一版实现 )
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

    // 添加视频 (下一版实现 )
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

            if ( name  ) {
                name = name.trim();
            }
            if ( type  ) {
                type = type.trim();
            }

			switch( type ){
				case 'string':
					data[name] = $elm.attr(name) || null;
					break;
                case 'bool':
                    data[name] = ($elm.attr(name)  !== undefined &&  $elm.attr(name)  !==  "false" &&  $elm.attr(name)  !==  "0")
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