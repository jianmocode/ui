/**
 * 简墨 Article 
 */

class Article {
	
	constructor( elm ) {
		this.article = $(elm);
	}

	init() {

		// fix cvideo 
		this.article.find('.mp-cvideo').each( function(idx, elm ){
			
			let w = $(elm).outerWidth();
			let h = $(elm).outerHeight();
			let aw = parseInt($(elm).attr('width') || w) || 1;
			let ah = parseInt($(elm).attr('height') || h) 
			let ratio = ah/aw;
			let fixh = w * ratio;

			$(elm).height(fixh);
			$(elm).children('iframe').height(fixh);
			$(elm).children('iframe').width(w);
			$(elm).children('iframe').attr('height', fixh);
			$(elm).children('iframe').attr('width', w);
		})
	}
}


export { Article }