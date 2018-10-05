/**
 * 简墨组件管理器
 */
const componentRoot = '../desktop/components/';
import ImageUploader from '../desktop/components/uploader/image';  
import ImageEditor from  '../desktop/components/editor/image';  

let components = {
	"uploader/image":ImageUploader,
	"editor/image":ImageEditor
};

class ComponentUtil {

	constructor( selector, option={}, component = null ) {
		this.selector = selector;
		this.component = component;
		this.option = option;

		// 初始化
		if ( component != null ) {
			this.load( option );
			return this.component;
		}

	}

	load( option ) {
		option['selector'] = this.selector;
		try {
			this.component.$load(option);
		} catch( e) { console.log('Load Component Error', this.component,  e); }

		$(option['selector']).data('_component', this.component.options );
	}

	setOption( option ) {
		this.option = option;
	}
}


function getComponent( selector ) {
	

	if ( $(selector).data('_component') ) {
		$(selector).data('_component').selector = selector;
		return $(selector).data('_component');
	}

	return new ComponentUtil(selector);
}


let $$ = getComponent;

// 用于动态扩展 Component
let $com = new ComponentUtil({});

/**
 * 加载组件
 * @return {[type]} [description]
 */
$$.import = function(){

	for ( var i in arguments ){

		if( !components[arguments[i]] ) {
			console.log(arguments[i], ' not found. ');
			continue;
		}
		try {
			// 添加组件名称方法
			let path = arguments[i];
			let name = components[path].options._name;
			if ( name ) {
				$com.__proto__[name] = function( option ){
					return new ComponentUtil(this.selector, option, components[path] );
				}
			}
		}catch( e ) { console.log(arguments[i], ' import error. ', e );}
	}
}

export {ComponentUtil, $$}

