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
            _that.handleClickCloseAsk()
            _that.handleClickAsk()
            _that.handleClickAddTopic()
            _that.handleClickDeleteTopic()
            _that.handleClickNext()
            _that.handleClickBack()
            _that.handleClickPublish()
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
      handleClickCloseAsk: function () {
            const _that = this

            $('.btn_del').on('click', function () {
                  $(this)
                        .parents('.ask_wrap')
                        .fadeOut()
            })
      },
      handleClickAsk: function () {
            const _that = this

            $('.btn_ask').on('click', function () {
                  $('.ask_wrap')
                        .fadeIn()
            })
      },
      handleClickAddTopic: function () {
            const _that = this

            $('.btn_add_topic').on('click', function () {
                  if ($('.input_tag').val()) {
                        let tagNodes = `
                              <div class="topic_item uk-flex uk-flex-middle">
                                    <span class="text">${$('.input_tag').val()}</span>
                                    <a class="btn_delete_topic"></a>
                              </div>
                        `
                        $('.topic_items').append(tagNodes)

                        let tagsNum = $('.topic_items').children('.topic_item').length

                        $('.tag_nums').text(`（${tagsNum}/5）`)

                        if (tagsNum >= 5) {
                              $('.btn_add_topic').hide()
                              $('.input_tag').css('width', '100%')
                              $('.tag_nums').css('right', '4%')
                        }
                  } else {
                        _that.showMessage('话题内容不能为空')
                  }
            })
      },
      handleClickDeleteTopic: function () {
            const _that = this

            $('.topic_items').on('click', '.btn_delete_topic', function () {
                  $(this)
                        .parent()
                        .remove()

                  let tagsNum = $('.topic_items').children('.topic_item').length

                  $('.tag_nums').text(`（${tagsNum}/5）`)

                  if (tagsNum < 5) {
                        $('.btn_add_topic').show()
                        $('.input_tag').css('width', '78%')
                        $('.tag_nums').css('right', '24%')
                  }
            })
      },
      handleClickNext: function () {
            const _that = this

            $('.btn_next').on('click', function () {
                  if ($('.question_title').val()) {
                        $('.ask_wrap').hide()
                        $('.ask_tag_wrap').show()
                  } else {
                        _that.showMessage('问题标题不能为空')
                  }
            })
      },
      handleClickBack: function () {
            $('.btn_back').on('click', function () {
                  $('.ask_tag_wrap').hide()
                  $('.ask_wrap').show()
            })
      },
      submitAskForm: function () {
            const _that = this

            let tags = ''
            let tags_array = []

            for (let i = 0; i < $('.topic_item .text').length; i++) {
                  tags_array[i] = $('.topic_item_text').eq(i).text()
            }

            tags = tags_array.join()

            let ask_form_data = tags ? `${$('#ask_form').serialize()}&tags=${tags}` : `${$('#ask_form').serialize()}`
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/create",
                  dataType: "json",
                  data: ask_form_data,
                  success: function (response) {
                        if (response._id) {
                              _that.showMessage('提问成功')

                              // setTimeout(() => {
                              //       window.location.href = `/qanda/detail/${response.question_id}`;
                              // }, 300);
                        } else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            });
      },
      handleClickPublish: function () {
            const _that = this;

            $('.btn_publish').on('click', function () {
                  _that.submitAskForm();
            })
      }
})