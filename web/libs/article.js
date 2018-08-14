/**
 * 简墨 Article 
 */

class Article {
	
	constructor( elm ) {
		this.article = $(elm);
		this.maxw = this.article.children('.jm-article-content').innerWidth();
	}

	init() {

		// fix cvideo 
		this.article.find('.mp-cvideo').each( (idx, elm ) => {
			
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