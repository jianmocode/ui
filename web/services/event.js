/**
 * 简墨 Event 
 */

class Event {
    constructor( event_id) {
        this.event_id  = event_id;
    }

    /**
     * 活动报名
     * @param {function} complete( status, response ){}
     */
    enter( complete ) {

        complete = complete || function( status, response ) {
            try {
                if (status == 'success') {
                    UIkit.notification({
                        message: '报名成功',
                        status: 'success',
                        pos: 'top-right'
                    });
                } else if ( status == 'error' ) {
                    UIkit.notification({
                        message: response.message,
                        status: 'danger',
                        pos: 'bottom-right'
                  });
                }
            } catch( e ) {}
        }

        $.ajax({
            type: "post",
            url: "/_api/xpmsns/pages/event/enter",
            dataType: "json",
            data: {
                event_id:this.event_id
            },
            success: function ( response ) {
                response = response || {};
                if ( response.code != undefined && response.code != 0 && response.message != '' ) {
                    complete( 'error', response );    
                    return;
                }

                complete( 'success', response);
            },
            error: function (error) {
                complete( 'error', {code:500, message:'出错啦', extra:{error:error} } );
            }
        });
    }

    /**
     * 取消活动报名
     * @param {function} complete( status, response ){}
     */
    cancelEnter( complete ) {

        complete = complete || function( status, response ) {
            try {
                if (status == 'success') {
                    UIkit.notification({
                        message: '取消报名成功',
                        status: 'success',
                        pos: 'top-right'
                    });
                } else if ( status == 'error' ) {
                    UIkit.notification({
                        message: response.message,
                        status: 'danger',
                        pos: 'bottom-right'
                  });
                }
            } catch( e ) {}
        }

        $.ajax({
            type: "post",
            url: "/_api/xpmsns/pages/event/cancelEnter",
            dataType: "json",
            data: {
                event_id:this.event_id
            },
            success: function ( response ) {
                response = response || {};
                if ( response.code != undefined && response.code != 0 && response.message != '' ) {
                    complete( 'error', response );    
                    return;
                }

                complete( 'success', response);
            },
            error: function (error) {
                complete( 'error', {code:500, message:'出错啦', extra:{error:error} } );
            }
        });
    }

    /**
     * 活动签到
     * @param {function} complete( status, response ){}
     */
    checkIn( complete ) {
        complete = complate || function( status, response ) {

        }
    }


}

export { Event }