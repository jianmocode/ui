import {
      isScrollToBottom,
      debounce
} from '../../services/service'

import {
      $$
} from '../../libs/component'

import { Event } from '../../services/event';

$$.import(
      'editor/image',
      'editor/html'
)

let web = getWeb()

Page({
      data: {},
      current_page_ranked: 1,
      current_page_recommend: 1,
      has_load_all: false,
      current_type: 'ranked',
      loadEditor: function () {
            try {
                  // HtmlEditor
                  $$('editor[type=html]').HtmlEditor({});
            } catch (e) {
                  console.log('Error @HtmlEditor', e);
            }
      },
      onReady: function () {
            const _that = this;
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