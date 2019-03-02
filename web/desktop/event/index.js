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
      }
})