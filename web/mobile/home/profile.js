let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this

            _that.handleClickBtnBack()
            _that.handleClickProfileItem()
            _that.handleClickBtnCancel()
            _that.handleClickBtnComplete()
      },
      showMessage: function (text) {
            const _el = $('.mask_wrap')

            _el
                  .find('.text')
                  .text(text)

            _el.stop()
            _el.fadeIn()

            setTimeout(function () {
                  _el.fadeOut()
            }, 2000)
      },
      handleClickBtnBack: function () {
            $('.header .btn_back').on('click', function () {
                  window.history.go(-1)
            })
      },
      handleClickProfileItem: function () {

            $('.profile_item').on('click', function () {
                  const __that = this

                  $('.edit_wrap').css('bottom', '0')

                  function setNickname() {
                        $('.edit_wrap .options .title').text('昵称')
                        $('.edit_wrap .editor').val($(__that).find('.right .text').text())
                        $('.edit_wrap .editor').attr('name', 'nickname')
                        $('.edit_wrap .options .btn_complete').data('currenttype', 'nickname')
                  }

                  function setIntro() {
                        $('.edit_wrap .options .title').text('简介')
                        $('.edit_wrap .editor').val($(__that).find('.right .text').text())
                        $('.edit_wrap .editor').attr('name', 'bio')
                        $('.edit_wrap .options .btn_complete').data('currenttype', 'intro')
                  }

                  function setSex() {
                        $('.edit_wrap .options .title').text('性别')
                        $('.edit_wrap .editor').val($(__that).find('.right .text').text())
                        $('.edit_wrap .editor').attr('name', 'sex')
                        $('.edit_wrap .options .btn_complete').data('currenttype', 'sex')
                  }

                  switch ($(this).data('type')) {
                        case 'nickname':
                              setNickname()
                              break;
                        case 'intro':
                              setIntro()
                              break;
                        case 'sex':
                              setSex()
                              break;
                  }
            })
      },
      handleClickBtnCancel: function () {
            const _that = this

            $('.edit_wrap .btn_cancel').on('click', function () {
                  $(this)
                        .parents('.edit_wrap')
                        .css('bottom', '-100vh')
            })
      },
      submitUserInfo: function (type, value) {
            const _that = this

            let data

            switch (type) {
                  case 'nickname':
                        data = {
                              nickname: value
                        }
                        break
                  case 'intro':
                        data = {
                              bio: value
                        }
                        break
                  case 'sex':
                        data = {
                              sex: value === '男' ? 1 : 0
                        }
                        break
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/user/user/updateProfile",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response.code === 0) {
                              _that.showMessage('修改成功')
                              window.location.reload()
                        } else {
                              _that.showMessage('修改失败')
                              $('.edit_wrap').css('bottom', '-100vh')
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      handleClickBtnComplete: function () {
            const _that = this

            $('.edit_wrap .options .btn_complete').on('click', function () {
                  _that.submitUserInfo($(this).data('currenttype'), $('.edit_wrap .editor').val())
            })
      }
})