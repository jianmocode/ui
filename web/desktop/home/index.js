
let web = getWeb();
Page({
	data:{},
	curr_ad:0,
	maxW:0,
	onReady: function( param ) {
		this.maxW = $('.article').innerWidth();
		this.fixImages();
	},


	/**
	 * 修复图片被压缩问题
	 * @return {[type]} [description]
	 */
	fixImages: function() {
		$('.mp-cimage').each(( idx, em)=>{
			if ( $(em).attr('width') > this.maxW ) {
				$(em).attr('height', '');
				$(em).css('height', '');
			}
		});
	}
})