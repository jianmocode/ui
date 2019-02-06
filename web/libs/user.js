/**
 * 简墨用户 
 */
class User {
	
	constructor( option ) {
	}

	login( user ) {
		
		// console.log( 'User login:', user );

		// 更新用户资料
		let fields = {
			nickname: ( $elm, value, user )=>{ 
                
                if ( value == null ) {
                    var moblie = user["mobile"] ? user["mobile"] : '13000000000';  
                    value=moblie.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                }

                $elm.find('[user-nickname]').html( value ); 
            },
			headimgurl: ( $elm, value ) => {
                if ( value == null ) return;

				if ( typeof value == 'object' && value.url ) {
					$elm.find('[user-headimgurl]').attr( 'src', value.url ); 
				}
			},
			bgimgurl: ( $elm, value ) => {
                
                if ( value == null ) return;

				if ( typeof value == 'object' && value.url ) {
					$elm.find('[user-bgimgurl]').attr( 'src', value.url ); 
				}
			}
		};

		// 页面数量
		let pages = [$('body')];
		if ( window.parent ) {  // iframe 登录的
			pages.push( window.parent.$('body') );
		}

		for ( var i in pages ) {
			let $elm = pages[i];

			// 替换数据
			for ( var field in fields ) {
				let fn = fields[field];
				let val = user[field];
				try { fn( $elm, val, user); } catch(e){
					console.log( 'update field error', e );
				}
			}

			// 隐藏数据
			$elm.find('.before-login').addClass('uk-hidden');
			$elm.find('.after-login').removeClass('uk-hidden');
		}

	}

	logout() {
	}

}

export { User }