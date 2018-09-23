let web = getWeb();
let com = Page({
	data:{},
	onReady: function( params ) {
		let $elms = $(params['selector']);
		let template = $('component[name=uploader-image]').html().toString();
		let html = Mustache.render(template, {src:"www.data.com", style:'helloworld'});
		console.log(  template, html, $elms.attributes );


	}
})

module.exports = com;