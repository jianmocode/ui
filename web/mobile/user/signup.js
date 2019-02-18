let web = getWeb();

Page({
      data: {},
      timer: '',
      onReady: function () {
            const _that = this

            _that.resizeBodyHeight()
            _that.getVcode()
            _that.getSMSCode()
            _that.handleClickSignup()
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
      getVcode: function () {
            //载入图形验证码
            $('.img_qr_code').on('click', function () {
                  $(this)
                        .attr('src', '/_api/xpmsns/user/user/vcode?width=80&height=40&size=20&' + Date.parse(new Date()));
            })
      },
      getSMSCode: function () {
            const _that = this;
            // 获取手机验证码
            $('.btn_get_message').on('click', function () {
                  $.ajax({
                        type: "get",
                        url: "/_api/xpmsns/user/user/getSMSCode",
                        dataType: "text",
                        data: {
                              _vcode: $('.verify_code').val(),
                              mobile: $('.mobile').val()
                        },
                        success: function (response) {
                              let json_data = JSON.parse(response);

                              if (json_data.code === 0) {
                                    _that.showMessage(json_data.message)

                                    _that.message_clock()
                              } else {
                                    _that.showMessage(json_data.message)
                              }
                        },
                        error: function (err) {
                              _that.showMessage(err)
                        }
                  });
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
            }, 2000);
      },
      message_clock: function () {
            const _el = $('.btn_get_message')
            _el.attr('disabled', 'true')
            let _timer = 60
            let _clock = setInterval(() => {
                  _el.html(_timer + 's')
                  if (_timer === 0) {
                        clearInterval(_clock)
                        _el.removeAttr('disabled')
                        _el.html('发送短信验证')
                  }
                  _timer = _timer - 1
            }, 1000)
      },
      handleClickSignup: function () {
            const _that = this

            let validate_input = false

            function submitForm() {
                  $.ajax({
                        type: "post",
                        url: "/_api/xpmsns/user/user/create",
                        dataType: "json",
                        data: $('#signup_form').serialize(),
                        success: function (response) {
                              if (response.code === 0) {
                                    _that.showMessage(response.message)

                                    setTimeout(function () {
                                          window.location.href = '/m/user/signin'
                                    }, 1000)
                              } else {
                                    _that.showMessage(response.message)
                              }


                        },
                        error: function (err) {
                              _that.showMessage(err)
                        }
                  })
            }

            $('.btn_signup').on('click', function () {
                  if ($('.first_password').val() === $('.second_password').val()) {
                        validate_input = true
                  }

                  if (validate_input) {
                        submitForm()
                  } else {
                        _that.showMessage('两次输入的密码不一致')
                  }
            })
      }
})