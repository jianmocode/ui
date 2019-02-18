let web = getWeb();

Page({
      data: {},
      resizeBodyHeight: function () {
            const initial_height = $(document).height()

            $(window).resize(function () {
                  if ($(document).height() < initial_height) {
                        $('.sundry').hide()
                  } else {
                        $('.sundry').css('display', 'flex')
                  }
            })
      },
      onReady: function () {
            const _that = this

            _that.resizeBodyHeight()
      }
})