import {
      debounce,
      isMobileScrollToBottom
} from '../../services/service'

let web = getWeb();

Page({
      data: {},
      current_page: 1,
      has_load_all: false,
      onReady: function () {
            const _that = this

            _that.handleClickBtnBack()
            _that.listenScroll()
            _that.handleClickShowAndHideAnswerContent()
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
      loadMoreAnswers: function () {
            const _that = this

            function updateAnswersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="answer_item uk-flex uk-flex-column border_box"
                              >
                                    <a
                                          class="question_title"
                                          href="/qanda/detail/${data[i].question_question_id}"
                                    >${data[i].question_title}</a>
                                    <div class="answer_content">
                                          <span class="summary answer_text">${data[i].summary}</span>
                                          <span class="content answer_text none">${data[i].content}</span>
                                          <button class="btn_show_all">
                                                <span class="text">显示全部</span>
                                                <img
                                                      class="icon_arrow_down"
                                                      src="${asset_path}/images/icon_arrow_down.svg"
                                                      alt="icon_arrow_down"
                                                >
                                          </button>
                                    </div>
                                    <div class="answer_options uk-flex uk-flex-between">
                                          <span class="option_item">${data[i].publish_time}</span>
                                          <button class="btn_collapse_answer uk-flex uk-flex-middle">
                                                <span class="text">收起</span>
                                                <img
                                                      class="img_collapse"
                                                      src="${asset_path}/images/icon_arrow_up.png"
                                                      alt="icon_collapse"
                                                >
                                          </button>
                                    </div>
                              </div>
                        `

                        $('.answers_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/answer/search",
                  dataType: "json",
                  data: {
                        page: _that.current_page + 1,
                        perpage: "12",
                        user_id: _that.data.user.user_id,
                        "select": "question.question_id,question.title,user_id,summary,content,publish_time",
                        publish_desc: "1"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateAnswersItems(response.data)
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
      handleClickShowAndHideAnswerContent: function () {
            const _that = this

            $('.answers_wrap').on('click', '.btn_show_all', function () {
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
            })

            $('.answers_wrap').on('click', '.btn_collapse_answer', function () {
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
            })
      },
})