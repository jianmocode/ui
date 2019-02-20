import {
      $$
} from '../../libs/component'

$$.import(
      'editor/image',
      'editor/html'
)


let web = getWeb();

Page({
      data: {},
      loadEditor: function () {
            try {
                  $$('editor[type=html]').HtmlEditor({})
            } catch (e) {
                  console.log('Error @HtmlEditor', e)
            }
      },
      onReady: function () {
            const _that = this

            _that.loadEditor()
            _that.handleClickCloseAnswer()
            _that.handleClickBtnAnswer()
            _that.handleClickSubmitAnswer()
            _that.handleClickBtnBack()
            _that.handleClickAnswerSummary()
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
      handleClickCloseAnswer: function () {
            $('.btn_del').on('click', function () {
                  $(this)
                        .parents('.go_answer_wrap')
                        .hide()
            })
      },
      handleClickBtnAnswer: function () {
            $('.btn_asnwer').on('click', function () {
                  $('.go_answer_wrap').fadeIn()
            })
      },
      submitAnswerForm: function () {
            const _that = this

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/answer/create",
                  dataType: "json",
                  data: $('#answer_form').serialize(),
                  success: function (response) {
                        if (response._id) {
                              _that.showMessage('回答成功')

                              setTimeout(() => {
                                    window.location.reload();
                              }, 300)
                        } else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err)
                  }
            })
      },
      handleClickSubmitAnswer: function () {
            const _that = this

            $('.btn_publish').on('click', function () {
                  if ($('.jm-editor-html #content_input').val()) {
                        _that.submitAnswerForm()
                  } else {
                        _that.showMessage('请输入答案内容')
                  }
            })
      },
      handleClickBtnBack: function () {
            $('.btn_back').on('click', function () {
                  $(this)
                        .parents('.answer_detail_wrap')
                        .hide()
            })
      },
      handleClickAnswerSummary: function () {
            $('.answer_items').on('click', '.answer_summary', function () {
                  window.location.href=`/m/qanda/detail/${$(this).data('questionid')}/answer/${$(this).data('answerid')}`
            })
      }
})