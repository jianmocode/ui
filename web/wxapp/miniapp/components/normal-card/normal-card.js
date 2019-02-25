Component({
      properties: {
            is_show: String,
            title: String,
            instruction: String,
            goto: String,
            goto_url: String
      },
      data: {

      },
      methods: {
            closeCard: function () {
                  this.setData({
                        is_show: 'false'
                  })
            },
            preventTouchMove: function () {

            },
            preventBubble: function () {

            },
      }
})