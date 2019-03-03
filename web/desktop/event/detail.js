import {
      isScrollToBottom,
      debounce
} from '../../services/service'

import {
      $$
} from '../../libs/component'

$$.import(
      'editor/image',
      'editor/html'
)

let web = getWeb()

Page({
    data: {},

    onReady: function ( data ) {
        this.loadContent();
    },

    /**
     * 解析团队内容
     */
    loadContent: function() {
        
        let $dom = $('.event-content .content').children();
        if ( $dom.length  > 1 ) {
            // 计算目录
            let catalog = [];
            $dom.each( (idx, elm  )=>{
                if ( $(elm).prop("tagName")  == 'H1' ) {
                    let name = $(elm).text();
                    let id = `catalog-${idx}`;
                    $(elm).attr('id', id);
                    catalog.push({
                        id:id,
                        name:name,
                        index:idx
                    });
                }
            });

            // 呈现目录
            if ( catalog.length > 0  ){
                for ( let i in catalog ) {
                    let c = catalog[i];
                    let n = catalog[i+1];

                    $('.event-content .catalog .items').append(
                        `<li><a href="#${c.id}"  uk-scroll="duration:200">${c.name}</a></li>`
                    );
                }

                // 呈现目录
                $('.event-content .catalog').removeClass('uk-hidden');
            }
        }

        // 替换 #{{USER_LIST}}
        let html = $('.event-content .content').html();
        if ( html.includes('#{{USER_LIST}}') ) {
            let team_list_html = this.getUserList();
            html = html.replace("#{{USER_LIST}}", team_list_html );
            $('.event-content .content').html(html);
        }

        // 呈现内容
        $('.event-content .content').removeClass('uk-hidden');
    },


    /**
     * 读取团队列表
     */
    getUserList: function(){
        return $('.event-content .user-list').html()
    }

})