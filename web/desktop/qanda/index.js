import {
      isScrollToBottom,
      debounce
} from '../../services/service'

import {
      $$
} from '../../libs/component'

$$.import(
      'editor/image',
      'editor/html'
)

let web = getWeb()

Page({
      data: {},
      current_page: 1,
      has_load_all: false,
      loadEditor: function () {
            try {
                  // HtmlEditor
                  $$('editor[type=html]').HtmlEditor({});
            } catch (e) {
                  console.log('Error @HtmlEditor', e);
            }
      },
      onReady: function () {
            const _that = this;

            _that.loadEditor();
            _that.handleClickAsk();
            _that.handleClickHideAsk();
            _that.handleClickAddTags();
            _that.handleUnfocusTagsInput();
            _that.handleKeydownTagsInput();
            _that.handleClickBtnDeleteTag();
            _that.handleClickPublish();
            _that.listenScrollPositioningRightAndLoadMore();
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
      handleClickAddTags: function () {
            $('.add_topic_wrap').on('click', function () {
                  $(this).hide()
                  $('.topic_text').val('')
                  $('.topic_text_wrap').css('display', 'flex')
            })
      },
      handleUnfocusTagsInput: function () {
            $('.topic_text').blur(function () {
                  $(this)
                        .parent()
                        .hide()

                  let tagsNum = $('.topic_items').children('.topic_item').length;

                  if (tagsNum < 5) {
                        $('.add_topic_wrap').show()
                  }
            })
      },
      handleKeydownTagsInput: function () {
            $('.topic_text').keydown(function (e) {
                  if ($(this).val() && e.which === 13) {
                        $('.topic_items').css('display', 'flex')

                        let tagNodes = `
                              <div class="topic_item uk-flex uk-flex-middle">
                                    <a class="topic_item_text">${$(this).val()}</a>
                                    <span class="btn_delete"></span>
                              </div>
                        `
                        $('.topic_items').append(tagNodes)

                        let tagsNum = $('.topic_items').children('.topic_item').length;
                        $('.topic_text_wrap').hide()
                        $('.btn_add_topic').text(`添加话题 (${tagsNum}/5)`)
                        if (tagsNum < 5) {
                              $('.add_topic_wrap').show()
                        }

                        return false;
                  }
            })
      },
      handleClickBtnDeleteTag: function () {
            $('.topic_items').on('click', '.btn_delete', function (e) {
                  $(this)
                        .parent()
                        .remove()

                  let tagsNum = $('.topic_items').children('.topic_item').length;
                  $('.btn_add_topic').text(`添加话题 (${tagsNum}/5)`)

                  if (tagsNum < 5) {
                        $('.add_topic_wrap').show()
                        if (tagsNum === 0) {
                              $('.topic_items').hide()
                        }
                  }
            })
      },
      submitAskForm: function () {
            let tags = ''
            let tags_array = []

            for (let i = 0; i < $('.topic_item_text').length; i++) {
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
                              UIkit.notification({
                                    message: '提问成功',
                                    status: 'success',
                                    pos: 'bottom-right'
                              });

                              setTimeout(() => {
                                    window.location.href = `/qanda/detail/${response.question_id}`;
                              }, 300);
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
      },
      loadMoreQuestions: function () {
            const _that = this

            function updateQuestionItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let is_summary_show = data[i].summary ? 'block' : 'none'
                        let nodes = `
                              <div
                                    class="question_item uk-flex uk-flex-column"
                                    mp:key="${data[i].question_id}"
                                    data-id="${data[i].question_id}"
                              >
                                    <a
                                          href="/qanda/detail/${data[i].question_id}"
                                          class="question_content"
                                    >${data[i].title}</a>
                                    <span class="best_answer answer_summary ${is_summary_show}">${data[i].summary}</span>
                              </div>
                        `
                        $('.question_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/search",
                  dataType: "json",
                  data: {
                        page: _that.current_page + 1,
                        perpage: "12",
                        select: "question_id,question.title,question.content,user.name,category.name,tags,user.user_id,status",
                        publish_desc: "1"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateQuestionItems(response.data)
                              _that.current_page = _that.current_page + 1
                        } else {
                              _that.has_load_all = true
                              $('.loadmore_wrap').hide()

                              UIkit.notification({
                                    message: '没有更多了',
                                    status: 'danger',
                                    pos: 'bottom-right'
                              })
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      listenScrollPositioningRightAndLoadMore: function () {
            const _that = this

            window.onscroll = debounce(function () {
                  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

                  if (scrollTop > 80) {
                        $('.content_wrap .right_wrap').css({
                              'transform': `translateY(-80px)`,
                              'position': 'fixed',
                              'margin-left': '704px'
                        })
                  } else {
                        $('.content_wrap .right_wrap').css({
                              'transform': 'translateY(0px)',
                              'position': 'initial',
                              'margin-left': '0'
                        })
                  }

                  if (isScrollToBottom() && !_that.has_load_all) {
                        _that.loadMoreQuestions()
                        $('.loadmore_wrap').show()
                  }
            }, 200)
      }
})