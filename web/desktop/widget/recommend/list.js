let web = getWeb();
let com = Page({
	data:{},
	onReady: function( params ) {
		
		$('.pagination .more').click(()=>{

			let vars = params.var || {};
			let slug = vars.slug || 0;
			let url = '/widget/recommend/list/' + slug;
			console.log('pagination more click', url,  params, this.data );
		});
	}
})

module.exports = com;