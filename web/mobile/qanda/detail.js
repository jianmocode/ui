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
      current_page: 1,
      has_load_all: false,
      current_rank_type: 'default',
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
            _that.handleClickBtnGoBack()
            _that.handleClickCloseAnswer()
            _that.handleClickBtnAnswer()
            _that.handleClickSubmitAnswer()
            _that.handleClickBtnBack()
            _that.handleClickAnswerSummary()
            _that.handleClickBtnShowAllQuestion()
            _that.listenScroll()
            _that.handleClickBtnRank()
            _that.handleClickBtnRankAs()
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
      handleClickBtnGoBack: function () {
            $('.btn_back').on('click', function () {
                  window.history.go(-1)
                  console.log(123);

            })
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
                  window.location.href = `/m/qanda/detail/${$(this).data('questionid')}/answer/${$(this).data('answerid')}`
            })
      },
      handleClickBtnShowAllQuestion: function () {
            $('.btn_show_all_question').on('click', function () {
                  $(this).hide()
                  $('.question_summary').hide()
                  $('.question_detail').slideDown()
            })
      },
      loadMoreAnswers: function () {
            const _that = this

            function updateAnswersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let user_headimgurl = data[i].user_headimgurl ? data[i].user_headimgurl.url : '/static-file/default/desktop/assets/images/elephant.svg'
                        let nickname = data[i].user_nickname ? data[i].user_nickname : data[i].user_mobile

                        let nodes = `
                              <div
                                    class="answer_item uk-flex uk-flex-column"
                                    data-id="${data[i].answer_id}"
                                    data-rippleria
                              >
                                    <a
                                          class="author uk-flex uk-flex-middle"
                                          href="#"
                                    >
                                          <img
                                                class="avatar_author"
                                                src="${user_headimgurl}"
                                                alt="avatar_author"
                                          >
                                          <span class="nickname line_clamp_1">${nickname}</span>
                                    </a>
                                    <div
                                          class="answer_summary"
                                          data-questionid="${_that.data.question_id}"
                                          data-answerid="${data[i].answer_id}"
                                    >${data[i].content}</div>
                              </div>
                        `

                        $('.answer_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/get",
                  dataType: "json",
                  data: {
                        question_id: _that.data.question_id,
                        withanswer: "1",
                        withagree: "1",
                        withrelation: "1",
                        page: _that.current_page + 1,
                        perpage: "8",
                        answer_select: "answer.user_id,answer.answer_id,answer.summary,answer.content,answer.agree_cnt,answer.publish_time,user.headimgurl,user.user_id,user.name,user.nickname,user.mobile,user.bio,user.answer_cnt,user.question_cnt,user.follower_cnt",
                        agree_desc: _that.current_rank_type === 'default' ? "1" : "",
                        publish_desc: _that.current_rank_type === 'time' ? "1" : ""
                  },
                  success: function (response) {
                        if (response.answers.data.length !== 0) {
                              updateAnswersItems(response.answers.data)
                              _that.current_page = _that.current_page + 1
                        } else {
                              _that.has_load_all = true
                              _that.showMessage('没有更多了')
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      listenScroll: function () {
            const _that = this

            window.onscroll = debounce(function () {
                  if (isMobileScrollToBottom() && !_that.has_load_all) {
                        _that.loadMoreAnswers()
                  }
            }, 200)
      },
      handleClickBtnRank: function () {
            $('.btn_rank').on('click', function () {
                  $('.rank_rules').fadeIn()
            })
      },
      handleClickBtnRankAs: function () {
            const _that = this

            $('.btn_rank_as').on('click', function () {
                  switch ($(this).data('type')) {
                        case 'default':
                              $('.btn_rank .text').text('按质量排序')
                              _that.current_rank_type = 'default'
                              break
                        case 'time':
                              $('.btn_rank .text').text('按时间排序')
                              _that.current_rank_type = 'time'
                              break
                  }

                  _that.loadRankedAnswers()

                  $(this)
                        .parents('.rank_rules')
                        .hide()

                  return false
            })

            $('body').on('click', function (e) {
                  const target = $(e.target)

                  if (!target.is('.btn_rank') && !target.is('.btn_rank .text') && !target.is('.btn_rank .icon_arrow_down')) {
                        $('.rank_rules').hide()
                  }
            })
      },
      loadRankedAnswers: function () {
            const _that = this

            $('.answer_items').html('')

            _that.has_load_all = false
            _that.current_page = 1

            function updateAnswersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let user_headimgurl = data[i].user_headimgurl ? data[i].user_headimgurl.url : '/static-file/default/desktop/assets/images/elephant.svg'
                        let nickname = data[i].user_nickname ? data[i].user_nickname : data[i].user_mobile

                        let nodes = `
                              <div
                                    class="answer_item uk-flex uk-flex-column"
                                    data-id="${data[i].answer_id}"
                                    data-rippleria
                              >
                                    <a
                                          class="author uk-flex uk-flex-middle"
                                          href="#"
                                    >
                                          <img
                                                class="avatar_author"
                                                src="${user_headimgurl}"
                                                alt="avatar_author"
                                          >
                                          <span class="nickname line_clamp_1">${nickname}</span>
                                    </a>
                                    <div
                                          class="answer_summary"
                                          data-questionid="${_that.data.question_id}"
                                          data-answerid="${data[i].answer_id}"
                                    >${data[i].content}</div>
                              </div>
                        `

                        $('.answer_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/get",
                  dataType: "json",
                  data: {
                        question_id: _that.data.question_id,
                        withanswer: "1",
                        withagree: "1",
                        withrelation: "1",
                        page: 1,
                        perpage: "8",
                        answer_select: "answer.user_id,answer.answer_id,answer.summary,answer.content,answer.agree_cnt,answer.publish_time,user.headimgurl,user.user_id,user.name,user.nickname,user.mobile,user.bio,user.answer_cnt,user.question_cnt,user.follower_cnt",
                        agree_desc: _that.current_rank_type === 'default' ? "1" : "",
                        publish_desc: _that.current_rank_type === 'time' ? "1" : ""
                  },
                  success: function (response) {
                        if (response.answers.data.length !== 0) {
                              updateAnswersItems(response.answers.data)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
})