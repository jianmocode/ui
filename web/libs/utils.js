/**
 * 简墨工具包 
 */
class Utils {

	constructor() {

		this.timerCounter = 5;
	}

	parentHeight( iframe='iframe' ){
		// console.log( 'run parentHeight ');
		try {
			// 如果是 iframe 载入，调整iframe 高度
			if ( window.parent.$ ) {
				let height = $('body').height();
				window.parent.$('iframe').height(height);
			}
		}catch( e ){
			console.log('fix iframe height Error', e );
		}
	}

	parentClose( iframe='iframe'  ){

		// console.log( 'run parentClose ');

		try {
			// 如果是 iframe 载入，调整iframe 高度
			if ( window.parent.$ ) {
				let height = $('body').height();
				window.parent.$('iframe').height(height);
			}
		}catch( e ){
			console.log('fix iframe height Error', e );
		}
	}


	timer( output='.timer', callback=()=>{}, counter = null ) {

		if ( counter !== null ) {
			this.timerCounter = counter;
		}

		$(output).html(this.timerCounter);
		this.timerCounter = this.timerCounter - 1;

		if ( this.timerCounter > 0 ) {
			setTimeout( ()=>{this.timer(output, callback); }, 1000);
			return;
		}
		callback();
	}
}

export { Utils }