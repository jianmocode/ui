let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this;

            _that.handleHoverUserAvatar();
      },
      handleHoverUserAvatar: function () {
            const _that = this;

            $('.answer_item .user_info').hover(
                  function () {
                        $(this)
                              .parent()
                              .find('.author_content')
                              .fadeIn()
                              .addClass('uk-flex uk-flex-column');
                  },
                  function () {
                        $(this)
                              .parent()
                              .find('.author_content')
                              .hide();

                        $(this)
                              .parent()
                              .find('.author_content').hover(
                                    function () {
                                          $(this)
                                                .show()
                                                .addClass('uk-flex uk-flex-column');
                                    },
                                    function () {
                                          $(this)
                                                .hide();
                                    }
                              )
                  }
            )
      }
})