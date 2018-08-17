let web = getWeb();
import videos from '../widget/recommend/video';  // 下一版应该可以引用组件

Page({
	data:{},
	onReady: function( params ) {
		try { this.initRecommendsNavbar(); } catch(e){
			console.log( 'Error @initRecommendsNavbar', e);
		}
		
		// 下载Session数据
		let sections = this.data.sections.data || [];
		let section = sections[0] || {};
		params['var']['slug'] = section.slug || null;
		console.log( section );
		if ( params['var']['slug'] ) {
			try { videos.$load(params, { section:this.data.r.section_1}); } catch(e){
				console.log( 'Error @videos.$load', e);
			}
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