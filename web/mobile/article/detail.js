let web = getWeb();
import articles from '../widget/category/list';  // 下一版应该可以引用组件
import {Article} from '../../libs/article.js';

Page({
	data:{},
	onReady: function( params ) {


		try { this.initRecommendsNavbar(); } catch(e){
			console.log( 'Error @initRecommendsNavbar', e);
		}

		try {
			( new Article( 'article' ) ).init();
		} catch( e ) {
			console.log( 'Error @Article init', e);
		}

		// try { articles.$load(
		// 		{
		// 			var: {cid:this.data.cate.category_id},
		// 			get: {subcate:this.data.subcate.category_id || '' },
		// 		},
		// 		{	
		// 			articles:this.data.articles, 
		// 			cate:this.data.cate, 
		// 			subcate: this.data.subcate
		// 		}); 
		// } catch(e){
		// 	console.log( 'Error @articles.$load', e);
		// }
	},

	/**
	 * 初始化推荐导航条
	 * @return {[type]} [description]
	 */
	initRecommendsNavbar: function() {


		$('.jm-recommends-navbar a').click(function(){
			$('.jm-recommends-navbar a').removeClass('nav-active');
			$(this).addClass('nav-active');
			let link = $(this).attr('data-remote');
			if ( link ) {
				$('.jm-recommends-body').html('<div uk-spinner class="uk-padding-small"></div>');
				$('.jm-recommends-body').load( link );
			}
			return true;
			// return false;
		})


		// Fix width
		let width = $('.jm-recommends-navbar').width();
		let w = 0;
		$('.jm-recommends-navbar a').each((idx, elm)=>{
			w += $(elm).outerWidth();
		})
		
		let offset = width - w;

		if ( offset > 0 ){
			$('.jm-recommends-navbar').append('<a style="width:'+ offset +'px"></a>');
		}
	}
})