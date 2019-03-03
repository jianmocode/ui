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

        let content = this.data.event.content || '';
        this.loadContent( content );
      
    },
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
                $('.event-content .catalog').removeClass('uk-hidden');
            }
        }

        $('.event-content .content').removeClass('uk-hidden');
        console.log( $dom.length );

    }
})