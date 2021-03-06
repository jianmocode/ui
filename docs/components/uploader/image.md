# Image Uploader

<p class="uk-text-lead"> 图片上传组件 </p>

## 使用方法

使用 `uploader` 标签，将 `type` 属性设定为 `image`

```html 
<uploader type="image"
	name="background" class="jm-form-large"
	url="/_api/xpmsns/user/user/upload?_n=background"
	allow="/(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i"
	accept=".ai,.png"
	>上传背景</uploader>
```

```html : demo 
<uploader type="image"
	name="background" class="jm-form-large"
	url="/_api/xpmsns/user/user/upload?_n=background"
	allow="/(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i"
	accept=".ai,.png"
	>上传背景</uploader>
```

## 初始赋值

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}'
	class="jm-form-large"  >上传背景</uploader>

```

## 分段上传

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	maxChunkSize="102400"
	value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}'
	class="jm-form-large"  >上传背景</uploader>
```

## 多图上传

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	value='[{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""},{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}]'
	class="jm-form-large"  multiple >上传背景</uploader>
```

## 固定比例 

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	ratio="16/9"
	value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}'
	class="jm-form-large"  >上传背景</uploader>
```


## 自由比例

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	ratio="auto"
	value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}'
	class="jm-form-large"  >上传背景</uploader>
```

## 拖拽响应

## 复制粘贴

## 表单样式

`.jm-form-large`     large 型号
`.jm-border-circle`  圆形

```html
<uploader type="image"
	url="/_api/xpmsns/user/user/upload?_n=background"
	name="background" 
	value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","title":"未命名1","link":"","summary":""}'
	class="jm-form-large jm-border-circle"  >上传背景</uploader>
```


***

## 参数

```javascript
import {$$} from '/libs/component.js';
$$.import(
	'uploader/image'
);


$$('<selector>').ImageUploader({
	add: function( file) {
		console.log('add file', file);
	},
	uploaded: function(){
		$utils.parentNotification( '<span uk-icon="icon: check;ratio:1.3"></span>  上传成功', 'success', 'top-right');
	},
	change: ( uploader, $item, src )=>{ $utils.parentHeight(); },
	error: (uploader, errors, $elm ) =>{
		for( var i in errors ){
			let error = errors[i];
			$utils.parentNotification( '<span uk-icon="icon: close;ratio:1.3"></span>  '+ error.message, 'danger', 'top-right');
		}
	}
});

```

参数表:

| Name          | Type      | Default                   | Description                                |
|:--------------|:----------|:--------------------------|:-------------------------------------------|
| `add`         | function  | `()=>{}`					| add 事件								     |
| `beforeupload`| function  | `()=>{}`					| beforeupload 事件					         |
| `uploaded`    | function  | `()=>{}`					| uploaded 事件		   	          	         |
| `error`       | function  | `()=>{}`				    | error 事件								     |
| `change`      | function  | `()=>{}`				    | change 事件								 |


***

## 属性

| Prop          | Type    | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `name`        | String  | `""`	  | 组件字段名称。								 |
| `id`  		| String  | `""`      | 组件字段ID 									 |
| `url`  		| String  | `""`      | 图片上传云端处理程序地址		  				 |
| `ratio`  		| String  | `""`      | 固定裁切									 |
| `allow`  		| String  | `""`      | 文件类型校验正则。例如: /(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i  |
| `accept`  	| String  | `""`      | 许可文件类型 .jpg,.png 						 |
| `maxFileSize` | Number  | `2097152` | 单位MB, 默认为2048 2GB 单位: kb				 |
| `maxChunkSize`| Number  | `""`      | 分段上传每次上传最大字节 单位: kb	             |
| `crop`  		| Object  | `""`      | 图片裁切选项 `ratio:16/9` 16/9固定比例裁切	 |
| `value`  		| Json    | `{}`      | 待处理图片数值。 `url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |
| `thumb`  		| String  | `url`     | 缩略图字段, 默认为 url						 |
| `title`  		| String  | `title`   | 标题字段，默认为 title						 |
| `titleClass`  | String  | `""`      | 标题栏样式表   				        		 |
| `titleStyle`  | String  | `""`      | 标题栏样式						             |

***

## 事件

| Event        	| Param   |  Description                               |
|:--------------|:--------|:-------------------------------------------|
| `add`  	    | `function(event, data)`   | 发起云端请求前触发，可通过 `return false;` 终止添加行为。|
| `beforeupload`| `function(event, data)`   | 发起云端请求前触发，可通过 `return false;` 终止上传行为。  |
| `uploaded`  	| `function(data, $item)`   | 云端请求成功执行并返回正确结果后触发。           |
| `error`  		| `function(errors, $elm)`  | 有错误发生时触发。	    					   |
| `change`  	| `function(data, $item)`   | 当数据发生变更时触发						   |

***


## 方法

### val()  读取当前数值

```javascript
let value = $$('<selector>').val();
console.log( value );

```

Object Value:

| Key           | Type    | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `url`         | String  | `""`	| 图片访问地址								 |
| `path`  		| String  | `""`    | 图片存储路径 								 |
| `title`  		| String  | `""`    | 图片标题		  				 			 |
| `summary`  	| String  | `""`    | 图片描述									 |
| `link`  		| String  | `""`    | 链接地址									 |
| `...`         | Mix     | 		| 其他自定义字段								 |



### disabled()  设定为 disabled

```javascript
$$('<selector>').disabled();

```

## enabled() 设定为 enabled
```javascript
$$('<selector>').enabled();

```

***

## 表单

作为表单提交时，字段数值为JSON字符串，结构为: 

| Key           | Type    | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `url`         | String  | `""`	| 图片访问地址								 |
| `path`  		| String  | `""`    | 图片存储路径 								 |
| `title`  		| String  | `""`    | 图片标题		  				 			 |
| `summary`  	| String  | `""`    | 图片描述									 |
| `link`  		| String  | `""`    | 链接地址									 |
| `...`         | Mix     | 		| 其他自定义字段								 |


```QueryString 
name={"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","url":"http://www.jianmoapp.com/static-file/media/2018/08/27/c966303bd5edd594320c6a7e5b9c83fe.jpg","title":"璀璨星空","link":"http://www.stardust.com","summary":"银河，大自然的馈赠。在这里孕育出拥有无上智慧的人类。"}
```

***

## 云端

当保存时，使用POST方法，向`url`属性设定的地址，提交标记数据；云端程序根据数据，对图片裁切后，返回全新图片信息。

### 请求数据

Form Data :

| Field                 | Type    	   | Description                                |
|:----------------------|:-------------|:-------------------------------------------|
| `_file_<name prop>`   | Blob		   |  当前切片图片文件							    |


如果设定 maxChunkSize prop, 在 RQEUST Header 中读取切片信息:

Header:

| Field                 | Type    	   |  Description                                        |
|:----------------------|:-------------|:----------------------------------------------------|
| `Content-Range`       | String	   | 当前切片信息	 `Content-Range: bytes 0-102399/181879` @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.16  		 |
| `Content-Disposition` | String	   | 文件名称等信息 `attachment; filename="icon-sm.png`    |



### 响应数据

成功返回 JSON Data:

| Field         | Type    	   | Return Value                                |
|:--------------|:-------------|:--------------------------------------------|
| `code`        | Number 	   |  0 						      			 |
| `message`     | String 	   |  保存成功 						      	     |
| `completed`   | Bool	       |  所有切片都上传完毕为 `true` , 否则为 `false`    |
| `progress`    | float        |  当前上传进度 0~100                            |
| `data`        | Object       |  如切片尚未完全上传，返回切片信息 {`total`:文件总大小, `from`: 当前切片起始位置, `to`: 当前切片结束位置, `type`:文件类型}。 否则返回图片数值。{`url`:图片访问地址, `path`:图片存储路径, `title`:图片标题,	 `summary`:图片描述, `link`:链接地址 ... 其他用户定义字段} |


失败返回 JSON Data: 

| Field         | Type    	   | Return Value                                |
|:--------------|:-------------|:--------------------------------------------|
| `code`        | Number 	   |  非零数值 					      			 |
| `message`     | String 	   |  错误描述 						      	 	 |
| `extra`       | Object 	   |  扩展错误信息 					      	 	 |


### 错误码

| Code          | Description                           	  |
|:--------------|:--------------------------------------------|
| `403`         | 无接口访问权限 						      	  |
| `404`         | 接口地址不存在, 请检查 url 属性是否正确 		  |
| `500`         | 服务器内部错误 					    		  |

***




