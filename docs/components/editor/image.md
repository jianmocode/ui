# Image Editor

<p class="uk-text-lead"> 图片裁切编辑器 </p>

## 使用方法

使用 `editor` 标签，将 `type` 属性设定为 `image`

```html 
<editor	type="image" 
		name="photocrop"
		url="/_api/xpmsns/user/user/upload"
		value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","url":"http://wss.xpmjs.com/static-file/media/2018/08/27/c966303bd5edd594320c6a7e5b9c83fe.jpg","title":"璀璨星空","link":"http://www.starover.com","summary":"银河，大自然的馈赠。在这里孕育出拥有无上智慧的人类。"}'
	></editor>
```


```html : demo 
<editor	type="image" 
		name="photocrop"
		url="/_api/xpmsns/user/user/upload"
		value='{"path":"/2018/08/27/e49e1d9c8899b789ce21191ac819e375.jpg","url":"http://wss.xpmjs.com/static-file/media/2018/08/27/c966303bd5edd594320c6a7e5b9c83fe.jpg","title":"璀璨星空","link":"http://www.starover.com","summary":"银河，大自然的馈赠。在这里孕育出拥有无上智慧的人类。"}'
	></editor>
```
**提醒**  `name` 和 `value` 属性必须设定

***

## 属性

| Prop          | Type    | Default | Description                                |
|:--------------|:--------|:--------|:-------------------------------------------|
| `name`        | String  | `""`	| 组件字段名称。								 |
| `id`  		| String  | `""`    | 组件字段ID 									 |
| `url`  		| String  | `""`    | 图片裁切云端处理程序地址		  				 |
| `crop`  		| Object  | `""`    | 图片裁切选项 `ratio:16/9` 16/9固定比例裁切	 |
| `value`  		| Json    | `{}`    | 待处理图片数值。 `url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |

***

## 事件

| Event        	| Param   |  Description                               |
|:--------------|:--------|:-------------------------------------------|
| `beforesave`  | event   | 点击保存按钮后，保存行为执行前触发，可通过 `return false;` 终止保存行为。|
| `save`  		| event   | 点击保存按钮后，发起云端请求前触发，可通过 `return false;` 终止保存行为。  |
| `saved`  		| event   | 点击保存按钮后，云端请求成功执行并返回正确结果后触发。   |
| `error`  		| event   | 有错误发生时触发。	    					   |
| `crop`  		| event   | 当裁切图片时候触发。						   |

***


## 方法

### save() 保存数据

```javascript
$$('<selector>').save((data, status, xhr)=>{
	console.log( data, status, xhr);
});

```
回调函数参数表

| NAME        	| Type    |  Description                               |
|:--------------|:--------|:-------------------------------------------|
| `data` 		| Object  |  返回结果  @see 云端 RESPONSE 			   |
| `status` 		| String  |  状态码 `success` 或 `error` 				   |
| `xhr` 		| Object  |  Ajax XHR  								   |


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
| `name`        | String 	   | `""`	| 组件字段名称							      |
| `value`       | JSON String  | `{}`	| 图片数值。`url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |
| `crop`        | JSON String  | `{"x":0,"y":0,"width":0,"height":0,"rotate":0,"scaleX":1,"scaleY":1}`	| 裁切信息。`x` 裁切起点x轴坐标, `y` 裁切起点y轴坐标, `width` 裁切宽度, `height` 裁切高度,  `rotate` 旋转角度, `scaleX` x轴方向拉伸, 	`scaleY` y轴方向拉伸	|


### 响应数据

成功返回 JSON Data:

| Field         | Type    	   | Return Value                                |
|:--------------|:-------------|:--------------------------------------------|
| `code`        | Number 	   |  0 						      			 |
| `message`     | String 	   |  数据保存成功 						      	 |
| `value`       | Object       |  新图片数值。`url` 图片访问地址, `path` 图片存储路径, `title` 图片标题,	 `summary` 图片描述, `link` 链接地址 ... 其他用户定义字段 |


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




