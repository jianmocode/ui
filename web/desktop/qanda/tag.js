import {
      isScrollToBottom,
      debounce
} from '../../services/service'

let web = getWeb()

Page({
      data: {},
      current_page: 1,
      has_load_all: false,
      onReady: function () {
            const _that = this;


            _that.listenScrollPositioningRightAndLoadMore();
      },
      loadMoreQuestions: function () {
            const _that = this

            function updateQuestionItems(data) {
                  for (let i = 0; i < data.length; i++) {
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
                              </div>
                        `
                        $('.question_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "get",
                  url: "/_api/xpmsns/qanda/question/search",
                  dataType: "json",
                  data: {
                        page: _that.current_page + 1,
                        perpage: "12",
                        tags: _that.data.tag,
                        select: "question_id,question.title,user.name,category.name,tags,user.user_id",
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
                  if (isScrollToBottom() && !_that.has_load_all) {
                        _that.loadMoreQuestions()
                        $('.loadmore_wrap').show()
                  }
            }, 200)
      }
})