Component({
      properties: {
            is_show_tips: String,
            text: String,
            btn_left_text: String,
            btn_left_url: String,
            btn_right_text: String,
            btn_right_url: String
      },
      data: {

      },
      methods: {
            closeCard: function () {
                  this.setData({
                        is_show_tips: 'false'
                  })
            },
            preventTouchMove: function () {

            },
            preventBubble: function () {

            }
      }
})