import { Event } from '../../../services/event';

Page({
	data:{},
	onReady: function( get ) {
    },

    /**
     * 活动报名
     */
    enter: function( e ){

        let event_id = $(e.target).attr('data-id') ||  null;
        if (event_id == null ) {

            return;
        }

        let event = new Event( event_id );
        event.enter(( status, response )=>{

            if ( status == 'error' ) {
                UIkit.notification({
                    message: response.message,
                    status: 'danger',
                    pos: 'top-right'
                });

                return;
            }

            // 更新报名信息(报名成功)
            $(`.action-enter[data-id=${event_id}]`).addClass('uk-hidden');
            $(`.action-cancel[data-id=${event_id}]`).removeClass('uk-hidden');
            $(`.user-cnt[data-id=${event_id}]`).html(response.user_cnt);

        });
    },


    /**
     * 取消报名
     */
    cancel: function( e ){
        let $elm = $(e.target);
        let event_id = $elm.attr('data-id') ||  null;
        if (event_id == null ) {
            return;
        }
        UIkit.drop($elm.parents('.remove-drop')).hide();

        let event = new Event( event_id );
        event.cancelEnter(( status, response )=>{

            if ( status == 'error' ) {
                UIkit.notification({
                    message: response.message,
                    status: 'danger',
                    pos: 'top-right'
                });

                return;
            }

            // 更新报名信息(报名成功)
            $(`.action-enter[data-id=${event_id}]`).removeClass('uk-hidden');
            $(`.action-cancel[data-id=${event_id}]`).addClass('uk-hidden');
            $(`.user-cnt[data-id=${event_id}]`).html(response.user_cnt);
        });
    }
})