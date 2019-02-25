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
      loadMoreQuestions: function () {
            const _that = this

            function updateQuestionItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let answer_cnt = data[i].answer_cnt ? data[i].answer_cnt : '0'

                        let nodes = `
                              <div
                                    class="question_item uk-flex uk-flex-column border_box"
                              >
                                    <a
                                          class="question_title"
                                          href="/qanda/detail/${data[i].question_id}"
                                          target="_blank"
                                    >${data[i].title}</a>
                                    <div class="question_options uk-flex">
                                          <span class="option_item">${data[i].publish_time}</span>
                                          <span class="option_item">${answer_cnt} 个回答</span>
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
                        page: _that.current_page + 1,
                        perpage: "12",
                        user_id: _that.data.user.user_id,
                        publish_desc: "1"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateQuestionItems(response.data)
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
                        _that.loadMoreQuestions()
                  }
            }, 200)
      },
})