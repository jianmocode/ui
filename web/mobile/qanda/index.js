import {
      debounce,
      isMobileScrollToBottom
} from '../../services/service'

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
      current_page_ranked: 1,
      current_page_recommend: 1,
      has_load_all: false,
      current_type: 'ranked',
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
            _that.handleClickToggleTab()
            _that.handleClickPublish()
            _that.listenScroll()
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
                  tags_array[i] = $('.topic_item .text').eq(i).text()
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

                              setTimeout(() => {
                                    window.location.href = `/qanda/detail/${response.question_id}`;
                              }, 300);
                        } else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      handleClickPublish: function () {
            const _that = this;

            $('.btn_publish').on('click', function () {
                  _that.submitAskForm();
            })
      },
      handleClickToggleTab: function () {
            const _that = this

            $('.tab_link').on('click', function () {
                  function reset() {
                        _that.has_load_all = false
                  }

                  switch ($(this).data('type')) {
                        case 'recommend':
                              reset()
                              _that.current_type = 'recommend'
                              break;
                        case 'ranked':
                              reset()
                              _that.current_type = 'ranked'
                              break;
                  }
            })
      },
      loadMoreQuestions: function () {
            const _that = this

            function updateQuestionsItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let nodes = `
                              <a
                                    class="question_item border_box"
                                    data-rippleria
                                    href="/m/qanda/detail/${data[i].question_id}"
                              >${data[i].title}</a>
                        `
                        if (_that.current_type === 'ranked') {
                              $('.hot_questions_page .question_items').append(nodes)
                        } else {
                              $('.recommend_page .question_items').append(nodes)
                        }
                  }
            }

            if (_that.current_type === 'ranked') {
                  $.ajax({
                        type: "post",
                        url: "/_api/xpmsns/qanda/question/search",
                        dataType: "json",
                        data: {
                              page: _that.current_page_ranked + 1,
                              perpage: "12",
                              select: "question_id,question.title,question.summary,question.content,user.name,category.name,tags,user.user_id",
                              publish_desc: "1"
                        },
                        success: function (response) {
                              if (response.data.length !== 0) {
                                    updateQuestionsItems(response.data)
                                    _that.current_page_ranked = _that.current_page_ranked + 1
                              } else {
                                    _that.has_load_all = true
                                    _that.showMessage('没有更多了')
                              }
                        },
                        error: function (err) {
                              console.log(err);
                        }
                  })
            } else {
                  $.ajax({
                        type: "post",
                        url: "/_api/xpmsns/pages/recommend/getContents",
                        dataType: "json",
                        data: {
                              page: _that.current_page_recommend + 1,
                              perpage: "12",
                              slugs: "qanda_recommend"
                        },
                        success: function (response) {
                              if (response.data.length !== 0) {
                                    updateQuestionsItems(response.data)
                                    _that.current_page_recommend = _that.current_page_recommend + 1
                              } else {
                                    _that.has_load_all = true
                                    _that.showMessage('没有更多了')
                              }
                        },
                        error: function (err) {
                              console.log(err);
                        }
                  })
            }
      },
      listenScroll: function () {
            const _that = this

            window.onscroll = debounce(function () {
                  if (isMobileScrollToBottom() && !_that.has_load_all) {
                        _that.loadMoreQuestions()
                  }
            }, 200)
      },
})