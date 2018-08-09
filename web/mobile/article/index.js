let web = getWeb();
import articles from '../widget/recommend/list';  // 下一版应该可以引用组件

Page({
	data:{},
	onReady: function( params ) {
		try { this.initRecommendsNavbar(); } catch(e){
			console.log( 'Error @initRecommendsNavbar', e);
		}

		params['var']['slug'] = 'section_1';
		try { articles.$load(params, { section:this.data.r.section_1}); } catch(e){
			console.log( 'Error @articles.$load', e);
		}
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
			// return true;
			return false;
		})
	}
})