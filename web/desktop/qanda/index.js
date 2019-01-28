let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this;

            _that.handleClickAsk();
            _that.handleClickHideAsk();
            _that.handleClickPublish();
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
      },
      submitAskForm: function () {
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/create",
                  dataType: "json",
                  data: $('#ask_form').serialize(),
                  success: function (response) {
                        if (response._id) {
                              UIkit.notification({
                                    message: '提问成功',
                                    status: 'success',
                                    pos: 'bottom-right'
                              });

                              setTimeout(() => {
                                    window.location.href = `/qanda/detail/${response.question_id}`;
                              }, 1000);
                        } else {
                              UIkit.notification({
                                    message: response.message,
                                    status: 'danger',
                                    pos: 'bottom-right'
                              })
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            });
      },
      handleClickPublish: function () {
            const _that = this;

            let isValidated = false;

            $('.btn_publish').on('click', function () {

                  if ($('.question_title').val()) {
                        isValidated = true;
                  } else {
                        UIkit.notification({
                              message: '请输入问题标题',
                              status: 'warning',
                              pos: 'bottom-right'
                        })
                  }

                  if (isValidated) {
                        _that.submitAskForm();
                  }
            })
      }
})