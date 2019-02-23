import {
      follow,
      unfollow
} from '../../../services/service';

let web = getWeb();

Page({
      data: {},
      current_page_question: 1,
      current_page_answer: 1,
      onReady: function () {
            const _that = this;
 
            _that.getTarget();
            _that.handleClickTabLick();
            _that.handleHoverCancelFollow();
            _that.handleClickFollow();
            _that.handleClickCancelFollow();
            _that.handleClickQuestionsLoadMore();
            _that.handleClickAnswersLoadMore();
            _that.handleClickShowAndHideAnswerContent();
      },
      resetTab: function () {
            $('.content_item').hide()
            $('.tab_link').removeClass('is_active')
      },
      resetIframeHeight: function () {
            $(window.parent.document)
                  .find(".iframe iframe")
                  .height($('.zhifou_wrap').height())
      },
      resetAnswerTabHeight: function () {
            $(window.parent.document)
                  .find(".iframe iframe")
                  .height($('.my_answers').height() + 61)
      },
      handleClickTabLick: function () {
            const _that = this

            $('.tab_link').on('click', function () {
                  switch (this.dataset.link) {
                        case 'my_questions':
                              _that.resetTab()
                              $('.my_questions').css('display', 'flex')
                              $('.tab_link_questions').addClass('is_active')
                              break;
                        case 'my_answers':
                              _that.resetTab()
                              $('.my_answers').css('display', 'flex')
                              $('.tab_link_answers').addClass('is_active')
                              break;
                  }

                  _that.resetIframeHeight()
            })
      },
      handleHoverCancelFollow: function () {
            $('.btn_cancel').hover(function () {
                  $(this).text('取消关注')
            }, function () {
                  $(this).text('已关注')
            })
      },
      handleClickFollow: function () {
            $('.my_followers').on('click', '.btn_follow', function () {
                  follow($(this).find('.text').data('id'))
            })
      },
      handleClickCancelFollow: function () {
            $('.my_following').on('click', '.btn_cancel', function () {
                  unfollow($(this).data('id'))
            })
      },
      handleClickShowAndHideAnswerContent: function () {
            const _that = this

            $('.my_answers .answer_items').on('click', '.btn_show_all', function () {
                  $(this)
                        .hide()

                  $(this)
                        .parents('.answer_item')
                        .find('.btn_collapse_answer')
                        .show()

                  $(this)
                        .parents('.answer_item')
                        .find('.summary')
                        .hide()

                  $(this)
                        .parents('.answer_item')
                        .find('.content')
                        .show()

                  _that.resetAnswerTabHeight()
            })

            $('.my_answers .answer_items').on('click', '.btn_collapse_answer', function () {
                  $(this)
                        .hide()

                  $(this)
                        .parents('.answer_item')
                        .find('.btn_show_all')
                        .show()

                  $(this)
                        .parents('.answer_item')
                        .find('.summary')
                        .show()

                  $(this)
                        .parents('.answer_item')
                        .find('.content')
                        .hide()

                  _that.resetAnswerTabHeight()
            })
      },
      getTarget: function () {
            const _that = this

            switch (sessionStorage.getItem('target')) {
                  case 'my_questions':
                        _that.resetTab()
                        $('.my_questions').css('display', 'flex')
                        $('.tab_link_questions').addClass('is_active')
                        break;
                  case 'my_answers':
                        _that.resetTab()
                        $('.my_answers').css('display', 'flex')
                        $('.tab_link_answers').addClass('is_active')
                        break;
            }

            _that.resetIframeHeight()
      },
      loadMoreQuestions: function () {
            const _that = this

            function updateQuestionItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let nodes = `
                              <div
                                    class="question_item uk-flex uk-flex-column"
                              >
                                    <a
                                          class="question_title"
                                          href="/qanda/detail/${data[i].question_id}"
                                          target="_blank"
                                    >${data[i].title}</a>
                                    <div class="question_options uk-flex">
                                          <span class="option_item">${data[i].publish_time}</span>
                                          <span class="dot">·</span>
                                          <span class="option_item">${data[i].answer_cnt} 个回答</span>
                                    </div>
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
                        page: _that.current_page_question + 1,
                        perpage: "6",
                        user_id: _that.data.user.user_id,
                        publish_desc: "1"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateQuestionItems(response.data)
                              _that.resetIframeHeight()
                              _that.current_page_question = _that.current_page_question + 1
                        } else {
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
      handleClickQuestionsLoadMore: function () {
            const _that = this

            $('.my_questions .btn_loadmore').on('click', function () {
                  _that.loadMoreQuestions()
            })
      },
      loadMoreAnswers: function () {
            const _that = this

            function updateAnswerItems(data) {
                  for (let i = 0; i < data.length; i++) {

                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="answer_item uk-flex uk-flex-column"
                              >
                                    <a
                                          class="question_title"
                                          href="/qanda/detail/${data[i].question_question_id}"
                                    >${data[i].question_title}</a>
                                    <div class="answer_content">
                                          <span class="summary answer_text">${data[i].summary}</span>
                                          <span class="content answer_text none">${data[i].content}</span>
                                          <button class="btn_show_all">
                                                显示全部
                                                <img
                                                      class="icon_arrow_down"
                                                      src="${asset_path}/images/icon_arrow_down.svg"
                                                      alt="icon_arrow_down"
                                                >
                                          </button>
                                    </div>
                                    <div class="answer_options uk-flex uk-flex-between">
                                          <span class="option_item">${data[i].publish_time}</span>
                                          <div class="btn_collapse_answer uk-flex uk-flex-middle">
                                                <span class="text">收起</span>
                                                <img
                                                      class="img_collapse"
                                                      src="${asset_path}/images/icon_arrow_up.png"
                                                      alt="icon_collapse"
                                                >
                                          </div> 
                                    </div>
                              </div>
                        `
                        $('.answer_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/answer/search",
                  dataType: "json",
                  data: {
                        page: _that.current_page_answer + 1,
                        perpage: "6",
                        user_id: _that.data.user.user_id,
                        select: "question.question_id,question.title,user_id,summary,content,publish_time",
                        publish_desc: "1"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateAnswerItems(response.data)
                              _that.resetIframeHeight()
                              _that.current_page_answer = _that.current_page_answer + 1
                        } else {
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
      handleClickAnswersLoadMore: function () {
            const _that = this

            $('.my_answers .btn_loadmore').on('click', function () {
                  _that.loadMoreAnswers()
            })
      }
})