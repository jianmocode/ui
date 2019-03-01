/**
 * 简墨 Article 
 */

class Article {
	
	constructor( elm ) {
		this.article = $(elm);
		this.maxw = this.article.children('.jm-article-content').innerWidth();
	}

	init() {

        let maxw = this.maxw;

        // 载入图片
        this.article.find('.jm-content-image').each( (idx,elm )=>{
            $(elm).load(function(){

                // 小图居中对齐
                let parent = $(this).parent();
                if ( parent && !parent.hasClass("jm-article-content")) {
                    parent.css("text-align", "center");

                }

                let naturalWidth =  this.naturalWidth ?  this.naturalWidth : 1;
                let ratio = this.naturalHeight / naturalWidth;
                if ( naturalWidth > maxw ) {
                    $(this).attr('width', maxw);
                    $(this).attr('height',maxw * ratio );
                }


            });
            let src = $(elm).attr("data-src");
            $(elm).attr('src', src );
        });



        // 下载链接
        this.article.find('.jm-content-attachment').each( (idx,elm )=>{
            $(elm).click(function(){
                let url = $(this).children(".attachment").attr("data-url");
                if ( url ) {
                    window.location = url;
                }
            })
        });


		// fix cvideo 
		this.article.find('.jm-content-video').each( (idx, elm ) => {
			
			let w = this.maxw;
			// let h = $(elm).innerHeight();
			// let aw = parseInt($(elm).attr('width') || w) || 1;
			// let ah = parseInt($(elm).attr('height') || h) 
			// // let ratio = ah/aw;
			let ratio = 9/16;
			let fixh = w * ratio;

			$(elm).height(fixh);
			$(elm).width(w);

			// fix iframe
			$(elm).children('iframe').height(fixh);
			$(elm).children('iframe').width(w);
			$(elm).children('iframe').attr('height', fixh);
			$(elm).children('iframe').attr('width', w);


			// fix video
			$(elm).children('video').height(fixh);
			$(elm).children('video').width(w);
			$(elm).children('video').attr('height', fixh);
			$(elm).children('video').attr('width', w);

			// console.log( w, fixh );
		})
	}
}


export { Article }