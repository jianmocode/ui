let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this;

            _that.handleClickAsk();
            _that.handleClickHideAsk();
      },
      showAskModal: function () {
            $('.ask_wrap')
                  .fadeIn()
                  .css({
                        'display': 'flex',
                        'justify-content': 'center',
                        'align-items': 'center'
                  });
            $('body').css('overflow', 'hidden');
      },
      hideAskModal: function () {
            $('.ask_wrap').fadeOut();
            $('body').css('overflow', 'auto');
      },
      handleClickAsk: function () {
            const _that = this;

            $('.ask').on('click', function () {
                  _that.showAskModal();
            })
      },
      handleClickHideAsk: function () {
            const _that = this;

            $('.btn_delete_modal').on('click', function () {
                  _that.hideAskModal();
            })
      }
})