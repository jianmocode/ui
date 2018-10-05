import { User } from './user.js';

/**
 * 简墨工具包 
 */
class Utils {

	constructor() {

		// 计数器
		this.timerCounter = 5;
		this.user = new User();
	}

	parentNotification( message, status, pos ){
		try {
			// 如果是 iframe 载入， 调用 error 发送通知
			if ( window.parent.Notification ) {
				window.parent.Notification(message, status, pos );
				return true;
			}
		}catch( e ){
			console.log('parentNotification Error', e );
			return false;
		}

		return false;
	}

	/**
	 * 调整窗体高度
	 * @param  {String} iframe [description]
	 * @return {[type]}        [description]
	 */
	parentHeight( iframe='iframe' ){
		// console.log( 'run parentHeight ');
		try {
			// 如果是 iframe 载入，调整iframe 高度
			if ( window.parent.$ ) {
				let height = $('body').height();
				window.parent.$('iframe').height(height);
				return true;
			}
		}catch( e ){
			console.log('parentHeight Error', e );
			return false;
		}

		return false;
	}

	/**
	 * 关闭弹窗
	 * @return {[type]} [description]
	 */
	parentClose(){
		try {
			// 如果是 iframe 载入，关闭弹窗
			if ( window.parent.UIkit ) {
				window.parent.UIkit.modal('#modal-iframe').hide();
				return true;
			}
		}catch( e ){
			console.log('parentClose Error', e );
			return false;
		}

		return false;
	}


	/**
	 * 计时器
	 * @param  String   output  倒计时数字呈现选择器
	 * @param  Function callback  倒计时完毕回调函数
	 * @return {[type]}            [description]
	 */
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