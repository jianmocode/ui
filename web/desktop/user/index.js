
let web = getWeb();
Page({
	data:{},
	smscodeTimer:0,
	onReady: function( get ) {
		var that = this;
		// 自动播放更换背景
		that.fixheight();
	},


	/**
	 * 修复高度
	 * @return {[type]} [description]
	 */
	fixheight: function() {
		$('.page').height($(document).height());
	}
})