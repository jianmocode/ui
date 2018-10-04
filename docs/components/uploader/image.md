# Image Uploader

<p class="uk-text-lead"> 图片上传组件 </p>

## 使用方法

使用 `uploader` 标签，将 `type` 属性设定为 `image`

```html 
<uploader type="image"
	name="background" class="jm-form-large"
	url="/_api/xpmsns/user/user/upload?_n=headimgurl"
	allow="/(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i"
	accept=".ai,.png"
	>上传背景</uploader>
```

```html : demo 
<uploader type="image"
	name="background" class="jm-form-large"
	url="/_api/xpmsns/user/user/upload?_n=headimgurl"
	allow="/(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i"
	accept=".ai,.png"
	>上传背景</uploader>
```

## 初始化赋值

## 分段上传

## 多图上传

## 固定比例 

## 自由比例

## 拖拽响应

## 复制粘贴

## 表单样式


***

## 属性

| Prop          | Type    | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `name`        | String  | `""`	| 组件字段名称。								 |
| `id`  		| String  | `""`    | 组件字段ID 									 |
| `url`  		| String  | `""`    | 图片上传云端处理程序地址		  				 |
| `ratio`  		| String  | `""`    | 固定裁切									 |
| `allow`  		| String  | `""`    | 文件类型校验正则。例如: /(\.|\/)(gif|jpe?g|png|xls|xlsx|ai)$/i  |
| `accept`  	| String  | `""`    | 许可文件类型 .jpg,.png 						 |
| `max`  		| Number  | `2048`  | 单位MB, 默认为2048 2GB						 |
| `maxChunkSize`| Number  | `""`    | 分段上传每次上传最大字节单位: kb	             |
| `crop`  		| Object  | `""`    | 图片裁切选项 `ratio:16/9` 16/9固定比例裁切	 |
| `value`  		| Json    | `{}`    | 待处理图片数值。 `url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |
| `thumb`  		| String  | `url`   | 缩略图字段, 默认为 url						 |
| `title`  		| String  | `title` | 标题字段，默认为 title						 |
| `titleClass`  | String  | `""`    | 标题栏样式表   				        		 |
| `titleStyle`  | String  | `""`    | 标题栏样式						             |

***

## 事件

| Event        	| Param   |  Description                               |
|:--------------|:--------|:-------------------------------------------|
| `add`  	    | event   | 添加文件。								   |
| `beforeupload`| event   | 发起云端请求前触发，可通过 `return false;` 终止上传行为。  |
| `uploaded`  	| event   | 云端请求成功执行并返回正确结果后触发。           |
| `error`  		| event   | 有错误发生时触发。	    					   |
| `change`  	| event   | 当数据发生变更时触发						   |

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

| Field         | Type    	   | Default | Description                                |
|:--------------|:-------------|:--------|:-------------------------------------------|
| `name`        | String 	   |    	| 组件字段名称							      |
| `_file`       | Blob		   |    	| 当前切片图片文件							      |
| `chuck`       | Number  	   | `1`	| 当前切片 Index							      |
| `chuckTotal`  | Number  	   | `20`	| 切片总数								      |


### 响应数据

成功返回 JSON Data:

| Field         | Type    	   | Return Value                                |
|:--------------|:-------------|:--------------------------------------------|
| `code`        | Number 	   |  0 						      			 |
| `message`     | String 	   |  数据保存成功 						      	 |
| `value`       | Object       |  如切片尚未完全上传 `null`， 否则返回图片数值。`url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |


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




