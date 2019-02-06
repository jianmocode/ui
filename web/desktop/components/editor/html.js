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
        "toolbar-sticky":"object",  // 工具栏是否置顶 ( "top:xx" ) 
        "maxChunkSize":"number"  // 切片大小
    },

    // 组件初始化
    onReady: function( params ) {

        // XMLHttpRequest sendAsBinary
        if (!XMLHttpRequest.prototype.sendAsBinary) {
            XMLHttpRequest.prototype.sendAsBinary = function (sData) {
                var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
                for (var nIdx = 0; nIdx < nBytes; nIdx++) {
                    ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
                }
                this.send(ui8Data);
            };
        }

        // Default Setting 
        Trix.config.blockAttributes.default.tagName = "p";
        Trix.config.blockAttributes.default.breakOnReturn = true;

        // + color 调色板属性
        Trix.config.textAttributes.color = {
            styleProperty:"color",
            inheritable: true,
            parser: function(element) {
                var style = getComputedStyle(element);
                return style.color !== ""
            }
        }

        // + Heading 
        const headings = [
            {name:"heading-1", tagName:'h1',  title:"一级标题"},
            {name:"heading-2", tagName:'h2', title:"二级标题"},
            {name:"heading-3", tagName:'h3',  title:"三级标题"},
            {name:"heading-4", tagName:'h4', title:"四级标题"},
            {name:"heading-5", tagName:'h5',  title:"五级标题"},
        ];

        for ( var i in headings ) {
            let h = headings[i];
            Trix.config.textAttributes[h.name] = {
                tagName:h.tagName,
                inheritable: false,
                parser: function(element) {
                    element.tagName !== h.tagName
                }
            }

            // Trix.config.blockAttributes[h.name] = {
            //     tagName: h.tagName,
            //     terminal: true,
            //     breakOnReturn: true,
            //     group: false
            // }
        }

        // + alignments
        const alignments = [
            {name:"align-left", value:"left", title:"左对齐" }, 
            {name:"align-center", value:"center",  title:"居中对齐" },  
            {name:"align-right", value:"right", title:"右对齐" }, 
            {name:"align-justify",  value:"justify",title:"两端对齐" }
        ];
        for ( var i in alignments ) {
            let ali = alignments[i];
            Trix.config.blockAttributes[ali.name] = {
                tagName: 'p-' + ali.name,
                breakOnReturn: true,
                group: false
            }
            
        }

        // + divider
        Trix.config.blockAttributes.divider = {
            tagName: 'hr',
            breakOnReturn: true,
            terminal: false,
            group: false
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
            
            // 文字对齐面板
            this.addNewBlock( event.target, "alignment");
            this.addAlignments( event.target );

            // 文字属性面板
            this.addNewBlock( event.target, "text");
            this.addColor( event.target );    // 添加颜色
            this.addHeading( event.target );  // 标题管理
            this.addDivider( event.target );  // 分割线

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
            
            let name =file.name;
            let total = file.size;
            let maxChunkSize  = ( attrs.maxChunkSize ? attrs.maxChunkSize : 512 )  * 1024 // 默认 512k
            let chunkCount = Math.ceil(total / maxChunkSize);
            
            for( let i =0; i<chunkCount; i++ ) {
                let start = i * maxChunkSize;
                let end = start + maxChunkSize;
                if ( end > total ) {
                    end = total;
                }
                

                // Send Remote 
                let xhr = new XMLHttpRequest();

                xhr.upload.addEventListener("progress", function(event) {
                    let progress = (start/total) * 100;
                    let progressMax = ((start+maxChunkSize)/total) * 100;
                    let p = progressMax - progress;
                    let chunckProgress = event.loaded / event.total
                    let totalProgress = progress + chunckProgress * p;

                    if ( totalProgress > 100 ) {
                        totalProgress = 100;
                    }

                    if ( totalProgress  ){
                        totalProgress = totalProgress.toFixed(2);
                    }

                    // console.log( 'totalProgress=', totalProgress, 'progress=', progress, ' chunckProgress=', chunckProgress, ' progressMax=', progressMax)
                    progressCallback(totalProgress);
                })

                xhr.addEventListener("load", ()=> {
                   
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
                    
                    if ( response.completed ) {
                        let data = response.data || {};
                        // console.log( data );
                        setContent(data);
                        successCallback(data);
                    }
                });

                let blob = file.slice(start, end, file.type);
                let formData = new FormData();
                    formData.append("file", blob, name);
                
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);
                xhr.setRequestHeader("Content-Range", `bytes ${start}-${end-1}/${total}`);
                xhr.send(formData);
                // console.log( "Content-Range", `bytes ${start}-${end-1}/${total}  size:${blob.size}` );
            }

            return;
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
                    name:new Date().getTime() + ".png",
                    size:'100kb'
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
            let attributes = data;
                attributes["previewable"] = false;
                attributes["href"] = data.url;
            
            if (!data.mime ){ 
                data.mime = "application/file";
            }
           
            if ( data.mime.includes("image") ) { // 图片
                // attributes["content"] = `
                //     <span class="trix-preview-image" data-url="${data.url}"  data-name="${file.name}" >
                //         <img src="${data.url}" /> 
                //     <span>
                // `;
                attributes["previewable"] = true;

            } else if ( data.mime.includes("video") ) { // 视频
                attributes["content"] = `
                    <span class="trix-preview-video jm-field-ignore"  data-url="${data.url}"  data-name="${file.name}" >
                        <video width="100%" height="auto" controls>
                            <source src="${data.url}" type="${data.mime}">
                        </video>
                    <span>
                `;
            } else if( data.mime.includes("audio") ) {

                attributes["content"] = `
                    <span class="trix-preview-audio jm-field-ignore"   data-url="${data.url}"  data-name="${file.name}" >
                        <audio controls>
                            <source src="${data.url}" type="${data.mime}">
                        </audio>
                    <span>
                `;

            } else {
                let ext = 'unknown';
                if ( data.url ) {
                    let uri = data.url.split(".");
                    if ( uri.slice ) {
                        ext = uri.slice(-1).pop();
                    }
                }
                
                attributes["content"] = `
                    <span class="trix-preview-file" data-url="${data.url}"  data-name="${file.name}" >
                        <span class="icon trix-preview-icon-${ext}"></span>
                        <span class="title"> ${file.name} </span>
                    <span>
                `;
            }
            try {
                attachment.setAttributes(attributes);
            }catch( e ) {
                console.log('setAttributes Error', e);
            }
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


    // 添加分割线
    addDivider: function( trix ) {
        
        let trixId = trix.trixId;
        let buttonContent = `
            <button type="button" 
                class="trix-button trix-button--icon trix-button--icon-divider" 
                onclick="
                    var trix = document.querySelector('trix-editor[trix-id=\\'${trixId}\\']');
                    trix.editor.insertHTML('<p><hr/></p>')
                "
                data-trix-key="+" title="分割线" tabindex="-1"></button>
        `;

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-text");
        blockElm.insertAdjacentHTML("beforeend", buttonContent);
    },

    // 添加对齐选项
    addAlignments: function( trix ){
        let trixId = trix.trixId;
        const alignments = [
            {name:"align-left", value:"left", title:"左对齐" }, 
            {name:"align-center", value:"center",  title:"居中对齐" },  
            {name:"align-right", value:"right", title:"右对齐" }, 
            {name:"align-justify",  value:"justify",title:"两端对齐" }
        ];
        let buttonContent = '';
        for ( var i in alignments ) {
            let ali = alignments[i];
            buttonContent += `
                <button type="button" 
                    onclick="
                        var trix = document.querySelector('trix-editor[trix-id=\\'${trixId}\\']');
                        var dialog = this.parentElement.parentElement.parentElement.parentElement;
                        trix.editor.deactivateAttribute('align-left');
                        trix.editor.deactivateAttribute('align-center');
                        trix.editor.deactivateAttribute('align-right');
                        trix.editor.deactivateAttribute('align-justify');
                        trix.editor.activateAttribute('${ali.name}');
                    "
                    class="trix-button trix-button--icon trix-button--icon-${ali.name}" 
                    data-trix-attribute="${ali.name}"
                    data-trix-method="setAttribute" 
                    data-trix-key="+" title="${ali.title}" tabindex="-1"></button>
            `;
        }

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-alignment");
        blockElm.insertAdjacentHTML("beforeend", buttonContent);
    },

    // 添加标题选项
    addHeading: function( trix ) {
        
        let trixId = trix.trixId;
        const headings = [
            {class:"heading-1", name:"一级标题"},
            {class:"heading-2", name:"二级标题"},
            {class:"heading-3", name:"三级标题"},
            {class:"heading-4", name:"四级标题"},
            {class:"heading-5", name:"五级标题"},
        ];
        
        function getHeadingItem( headings ) {
            let headingItem = '';
            for( var i in headings ) {
                let h = headings[i];
                let name = "heading-" + ( parseInt(i) + 1);
                headingItem += `
                    <li>
                        <a  
                            href="javascript:void(0);"
                            onclick="
                                var trix = document.querySelector('trix-editor[trix-id=\\'${trixId}\\']');
                                var dialog = this.parentElement.parentElement.parentElement.parentElement;
                                var selected = dialog.querySelector('a[data-trix-active]');
                                if ( selected  ){
                                    var name = selected.getAttribute('data-trix-attribute');
                                    if ( name != this.getAttribute('data-trix-attribute') ) {
                                        trix.editor.deactivateAttribute(name);
                                        trix.editor.activateAttribute(this.getAttribute('data-trix-attribute'));
                                    }
                                }
                            "
                            class="trix-dialog-heading-item trix-button" 
                            data-trix-attribute="${name}" 
                            data-trix-method="setAttribute"
                        >
                            <span class="${h.class} trix-dialog-heading">${h.name}</span>
                        </a>
                    </li>
                `;
            }
            return headingItem;
        }

        let headingItem = getHeadingItem( headings );

        let buttonContent = `
            <button type="button" 
                class="trix-button trix-button--icon trix-button--icon-heading" 
                data-trix-attribute="heading" 
                data-trix-key="+" title="标题" tabindex="-1"></button>
        `;

        let dialogContent = `
            <div class="trix-dialog trix-dialog--heading" data-trix-dialog="heading" data-trix-dialog-attribute="heading"  >
                <input 
                    type="hidden" name="heading" 
                    data-trix-input required >
                <ul>
                    ${headingItem}
                    <li>
                        <a  href="javascript:void(0);"
                            class="trix-dialog-heading-item" 
                            onclick="
                                var trix = document.querySelector('trix-editor[trix-id=\\'${trixId}\\']');
                                var dialog = this.parentElement.parentElement.parentElement.parentElement;
                                var selected = dialog.querySelector('a[data-trix-active]');
                                if ( selected  ){
                                    var name = selected.getAttribute('data-trix-attribute');
                                    trix.editor.deactivateAttribute(name);
                                }
                            "
                            data-trix-method="removeAttribute" 
                        >
                            <span class="trix-dialog-normal">正文</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;

        let toolBar = trix.toolbarElement;
        let blockElm = toolBar.querySelector(".trix-button-group-text");
        var dialogElm = toolBar.querySelector(".trix-dialogs");
        blockElm.insertAdjacentHTML("beforeend", buttonContent);
        dialogElm.insertAdjacentHTML("beforeend", dialogContent);
    },


    // 添加颜色选择
    addColor: function( trix ) {

        // 色板
        const colors = {
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
                    type="hidden" name="color" data-trix-input required >

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