let web = getWeb();
let com = Page({
	data:{},
	onReady: function( params ) {
		
		// 翻页
		$('.pagination .more').click(()=>{

			console.log( params );

			let vars = params.var || {};
			let slug = vars.slug || 0;
			let page = $('.pagination .more').attr('data-next') || 1; 
			if ( page == false ) {
				return ;
			}

			let url = '/widget/recommend/list/' + slug + '?page=' + page;

			$('.pagination .more').html('加载中...');
			$.get(url, function(html) {
				html = '<div>' + html + '</div>';
				var items = $(html).find('.articles').html();
				$('.articles').append( items );

				// 翻页
				var next = $(html).find('.pagination .more').attr('data-next');
				if ( next ) {
					$('.pagination .more').attr('data-next', next).html('加载更多');
				} else {
					$('.pagination .more').remove();
				}
			});

		});
	}
})

module.exports = com;