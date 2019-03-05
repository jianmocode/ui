import {
      setCookie
} from '../../services/service'

let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this

            _that.resizeBodyHeight()
            _that.getVcode()
            _that.handleClickLogin()
      },
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
      showMessage: function (text) {
            const _that = this
            const _el = $('.mask_wrap')

            _el
                  .find('.text')
                  .text(text)

            if (_that.timer) {
                  clearTimeout(_that.timer)
            }

            _el.stop()
            _el.fadeIn()

            _that.timer = setTimeout(function () {
                  _el.fadeOut()
            }, 2000)
      },
      getVcode: function () {
            //载入图形验证码
            $('.img_qr_code').on('click', function () {
                  $(this)
                        .attr('src', '/_api/xpmsns/user/user/vcode?width=80&height=40&size=20&' + Date.parse(new Date()));
            })
      },
      handleClickLogin: function () {
            const _that = this

            $('.btn_signin').on('click', function () {
                  $.ajax({
                        type: "post",
                        url: "/_api/xpmsns/user/user/login",
                        dataType: "json",
                        data: $('#login_form').serialize(),
                        success: function (response) {
                              if (response.user_id) {
                                    _that.showMessage('登录成功')

                                    setCookie('__client_token', response.client_token, 2);

                                    setTimeout(function () {
                                          window.location.href='/m/home/index'
                                    },300)
                              } else {
                                    _that.showMessage(response.message)
                              }
                        },
                        error: function (err) {
                              _that.showMessage(err.message)
                        }
                  });
            })

      }
})