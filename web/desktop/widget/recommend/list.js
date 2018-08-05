let web = getWeb();
let com = Page({
	data:{},
	onReady: function( params ) {
		
		// 翻页
		$('.pagination .more').click(()=>{

			let vars = params.var || {};
			let slug = vars.slug || 0;
			let page = $('.pagination .more').data('next') || 1; 
			if ( page === false ) {
				return ;
			}

			let url = '/widget/recommend/list/' + slug + '?page=' + page;

			$('.pagination .more').html('加载中...');
			$.get(url, function(html) {
				html = '<div>' + html + '</div>';
				var items = $(html).find('.articles').html();
				$('.articles').append( items );
				$('.pagination .more').html('加载更多');
			});

		});
	}
})

module.exports = com;