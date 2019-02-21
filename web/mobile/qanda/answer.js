import {
      mobileFollow,
      mobileUnfollow
} from '../../services/service'

let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this

            _that.listenHeaderHeight()
            _that.handleClickBtnBack()
            _that.handleClickAnswerAgree()
            _that.handleClickFollowAnswerPerson()
            _that.handleClickUnfollowAnswerPerson()
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
      listenHeaderHeight: function () {
            $('.answer_content_wrap').css('margin-top', $('.answer_header').height())
      },
      handleClickBtnBack: function () {
            $('.btn_back').on('click', function () {
                  window.history.go(-1)
            })
      },
      createAgree: function (data) {
            const _that = this

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/create",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      removeAgree: function (data) {
            const _that = this

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/remove",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      handleClickAnswerAgree: function () {
            const _that = this;

            $('.options_wrap').on('click', '.btn_agree', function () {
                  $(this).hide();
                  $(this)
                        .parents('.options_wrap')
                        .find('.btn_agree_clicked')
                        .css('display', 'flex')

                  _that.createAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })

            $('.options_wrap').on('click', '.btn_agree_clicked', function () {
                  $(this).hide();
                  $(this)
                        .parents('.options_wrap')
                        .find('.btn_agree')
                        .css('display', 'flex')

                  _that.removeAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })
      },
      handleClickFollowAnswerPerson: function () {
            $('.author_wrap').on('click', '.btn_follow', function () {
                  mobileFollow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_wrap')
                        .find('.btn_unfollow_real')
                        .show()
            })
      },
      handleClickUnfollowAnswerPerson: function () {
            $('.author_wrap').on('click', '.btn_unfollow', function () {
                  mobileUnfollow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_wrap')
                        .find('.btn_follow_real')
                        .show()
            })
      },
   
})