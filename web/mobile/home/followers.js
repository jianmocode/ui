import {
      mobileFollow,
      debounce,
      isMobileScrollToBottom
} from '../../services/service';

let web = getWeb();

Page({
      data: {},
      current_page: 1,
      has_load_all: false,
      onReady: function () {
            const _that = this

            _that.handleClickBtnBack()
            _that.handleClickFollow()
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
      handleClickFollow: function () {
            $('.follower_items').on('click', '.btn_follow', function () {
                  mobileFollow($(this).find('.text').data('id'))
            })
      },
      loadMoreFollowers: function () {
            const _that = this
 
            function updateItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let follower_headimgurl = data[i].follower_headimgurl ? data[i].follower_headimgurl.url : '/static-file/default/desktop/assets/images/elephant.svg'
                        let nickname = data[i].following_nickname ? data[i].following_nickname : data[i].follower_user_id
                        let follower_bio = data[i].follower_bio ? data[i].follower_bio : 'TA还没有简介哦'
                        let follower_answer_cnt = data[i].follower_answer_cnt ? data[i].follower_answer_cnt : '0'
                        let follower_question_cnt = data[i].follower_question_cnt ? data[i].follower_question_cnt : '0'
                        let follower_follower_cnt = data[i].follower_follower_cnt ? data[i].follower_follower_cnt : '0'

                        let nodes = `
                              <div
                                    class="follower_item uk-flex uk-flex-between"
                              >
                                    <a href="#">
                                          <img
                                                class="img_avatar"
                                                src="${follower_headimgurl}"
                                                alt="img_avatar"
                                          >
                                    </a>
                                    <div class="options uk-flex uk-flex-between uk-flex-middle">
                                          <div class="left uk-flex uk-flex-column">
                                                <div class="user_info uk-flex uk-flex-middle">
                                                      <a class="nickname">${nickname}</a>
                                                      <span class="line">|</span>
                                                      <span class="intro line_clamp_1">${follower_bio}</span>
                                                </div>
                                                <div class="user_success uk-flex">
                                                      <span class="success_item">${follower_answer_cnt}回答</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">${follower_question_cnt}文章</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">${follower_follower_cnt}关注者</span>
                                                </div>
                                          </div>
                                          <div class="right">
                                                <button
                                                      class="btn btn_follow"
                                                      data-id="${data[i].follower_user_id}"
                                                >关注</button>
                                          </div>
                                    </div>
                              </div>
                        `
                        $('.follower_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/user/follow/getFollowers",
                  dataType: "json",
                  data: {
                        page: _that.current_page + 1,
                        perpage: "12"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateItems(response.data)
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
                        _that.loadMoreFollowers()
                  }
            }, 200)
      },
})