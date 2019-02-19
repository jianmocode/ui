import {
      follow,
      unfollow,
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


let web = getWeb();

Page({
      data: {},
      loadEditor: function () {
            try {
                  $$('editor[type=html]').HtmlEditor({})
            } catch (e) {
                  console.log('Error @HtmlEditor', e)
            }
      },
      onReady: function () {
            const _that = this

            _that.loadEditor()
      },
})