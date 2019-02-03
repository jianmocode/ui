let com = Page({
    _name:'HtmlEditor',
	data:{},
	template: '<textarea>HTML文本编辑器</textarea>',
	events: {},
	props: {
        "disabled":"bool",  // 是否 disabled
        "autofocus":"bool",  // 是否 自动聚焦
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
            // this.addImage( event.target ); // 添加图片
            // this.addVideo( event.target ); // 添加视频
            this.addAttach( event.target ); // 添加附件
        });
    },

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

        // 处理文件上传
        var elm = $('.jm-editor-html',$elm).get(0);
        if ( elm ) {
            elm.addEventListener("trix-attachment-add", (event) => {
                this.bindFileUploadHandler( event.target, event.attachment, attrs["url"] );
            });
        }
    },
    
    // 文件管理器
    bindFileUploadHandler( trix, attachment, url ) {
        if ( url == null || url == "" ) {
            console.log('未指定文件上传云端服务地址(上传文件功能将无法使用)', " trix-id=", trix.getAttribute("trix-id"), attachment );
            return;
        }

        // 上传文件
        uploadFileAttachment( attachment );

        function uploadFileAttachment(attachment) {

            uploadFile(attachment, setProgress, setAttributes)

            function setProgress(progress) {
              attachment.setUploadProgress(progress)
            }
        
            function setAttributes(data) {
              console.log(attachment);
            }
        }

        /**
         * 上传文件 ( 下一版应该支持分段上传 )
         */
        function uploadFile(attachment, progressCallback, successCallback) {

            // Check File
            let file = attachment.file;

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
                    console.log('upload error');
                    attachment.remove();
                    return;
                }

                // 上传失败
                if ( response.code != 0 || typeof response.data != "object" ) {
                    let message = response.message || "上传失败";
                    attachment.remove();
                    console.log( message );
                    return;
                }


                let data = response.data || {};
                setContent( attachment, data);
                successCallback(data);
            })
        
            xhr.send(formData);
        }


        function setContent( attachment, data ) {

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