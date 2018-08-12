let web = getWeb();
import articles from '../widget/category/list';  // 下一版应该可以引用组件

Page({
	data:{},
	onReady: function( params ) {
		try { this.initRecommendsNavbar(); } catch(e){
			console.log( 'Error @initRecommendsNavbar', e);
		}
		try { articles.$load(
				{
					var: {cid:this.data.cate.category_id},
					get: {subcate:this.data.subcate.category_id || '' },
				},
				{	
					articles:this.data.articles, 
					cate:this.data.cate, 
					subcate: this.data.subcate
				}); 
		} catch(e){
			console.log( 'Error @articles.$load', e);
		}
	},

	/**
	 * 初始化推荐导航条
	 * @return {[type]} [description]
	 */
	initRecommendsNavbar: function() {
		$('.jm-recommends-navbar a').click(function(){
			$('.jm-recommends-navbar li').removeClass('uk-active');
			$(this).parent().addClass('uk-active');
			let link = $(this).attr('data-remote');
			if ( link ) {
				$('.jm-recommends-body').html('<div uk-spinner class="uk-padding-small"></div>');
				$('.jm-recommends-body').load( link );
			}
			return true;
		})
	}
})