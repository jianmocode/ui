Page({
	data:{},
	onReady: function( get ) {
    },

    /**
     * 读取文章详情
     * @param {event} event 
     */
    openArticle: function(event) {
        let $elm = $(event.target)
        let id = $elm.attr("data-id");
        $('#articleDetail').modal({
            keyboard: false
        });
    },

    /**
     * 通过发布请求
     * @param {event} event 
     */
    resolve: function( event ) {
        console.log( event );
    },

    /**
     * 驳回发布请求
     * @param {Event} event 
     */
    reject: function( event ) {
        console.log( event );
    }

})