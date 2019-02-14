import {
      follow,
      unfollow
} from '../../../services/service';

let web = getWeb();

Page({
      data: {},
      current_page_followers: 1,
      current_page_following: 1,
      onReady: function () {
            const _that = this;

            _that.getTarget();
            _that.handleClickTabLick();
            _that.handleHoverCancelFollow();
            _that.handleClickFollow();
            _that.handleClickCancelFollow();
            _that.handleClickFollowersLoadMore();
            _that.handleClickFollowingLoadMore();
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
      handleClickTabLick: function () {
            const _that = this

            $('.tab_link').on('click', function () {
                  switch (this.dataset.link) {
                        case 'my_followers':
                              _that.resetTab()
                              $('.my_followers').css('display', 'flex')
                              $('.tab_link_followers').addClass('is_active')
                              break;
                        case 'my_following':
                              _that.resetTab()
                              $('.my_following').css('display', 'flex')
                              $('.tab_link_following').addClass('is_active')
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
      getTarget: function () {
            const _that = this

            switch (sessionStorage.getItem('target')) {
                  case 'my_followers':
                        _that.resetTab()
                        $('.my_followers').css('display', 'flex')
                        $('.tab_link_followers').addClass('is_active')
                        break;
                  case 'my_following':
                        _that.resetTab()
                        $('.my_following').css('display', 'flex')
                        $('.tab_link_following').addClass('is_active')
                        break;
            }

            _that.resetIframeHeight()
      },
      loadMoreFollowers: function () {
            const _that = this

            function updateFollowersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let nickname = data[i].follower_nickname ? data[i].follower_nickname : data[i].follower_name

                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="follower_item uk-flex uk-flex-between"
                              >
                                    <a href="#">
                                          <img
                                                class="img_avatar"
                                                src="${asset_path}/images/img_avatar_eg.jpg"
                                                alt="img_avatar"
                                          >
                                    </a>
                                    <div class="options uk-flex uk-flex-between uk-flex-middle">
                                          <div class="left uk-flex uk-flex-column">
                                                <div class="user_info uk-flex uk-flex-middle">
                                                      <a class="nickname">${nickname}</a>
                                                      <span class="line">|</span>
                                                      <span class="intro line_clamp_1">多年专注Logo设计 kgdesign.cn多年专注Logo设计
                                                            kgdesign.cn多年专注Logo设计 kgdesign.cn</span>
                                                </div>
                                                <div class="user_success uk-flex">
                                                      <span class="success_item">85 回答</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">60 提问</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">16,047 关注者</span>
                                                </div>
                                          </div>
                                          <div class="right">
                                                <button class="btn_follow">
                                                      <span
                                                            class="text"
                                                            data-id="${data[i].follower_user_id}"
                                                      >关注TA</span>
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        `
                        $('.my_followers .follower_items').append(nodes)
                  }
            }

            $.ajax({ 
                  type: "post",
                  url: "/_api/xpmsns/user/follow/getFollowers",
                  dataType: "json",
                  data: {
                        page: _that.current_page_followers + 1,
                        perpage: "6"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateFollowersItems(response.data)
                              _that.resetIframeHeight()
                              _that.current_page_followers = _that.current_page_followers + 1
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
      handleClickFollowersLoadMore: function () {
            const _that = this

            $('.my_followers .btn_loadmore').on('click', function () {
                  _that.loadMoreFollowers()
            })
      },
      loadMoreFollowing: function () {
            const _that = this

            function updateFollowingItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let nickname = data[i].user_nickname ? data[i].user_nickname : data[i].user_name

                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="follower_item uk-flex uk-flex-between"
                              >
                                    <a href="#">
                                          <img
                                                class="img_avatar"
                                                src="${asset_path}/images/img_avatar_eg.jpg"
                                                alt="img_avatar"
                                          >
                                    </a>
                                    <div class="options uk-flex uk-flex-between uk-flex-middle">
                                          <div class="left uk-flex uk-flex-column">
                                                <div class="user_info uk-flex uk-flex-middle">
                                                      <a class="nickname">${nickname}</a>
                                                      <span class="line">|</span>
                                                      <span class="intro line_clamp_1">多年专注Logo设计 kgdesign.cn多年专注Logo设计
                                                            kgdesign.cn多年专注Logo设计 kgdesign.cn</span>
                                                </div>
                                                <div class="user_success uk-flex">
                                                      <span class="success_item">85 回答</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">60 文章</span>
                                                      <span class="dot">·</span>
                                                      <span class="success_item">16,047 关注者</span>
                                                </div>
                                          </div>
                                          <div class="right">
                                                <button
                                                      class="btn_cancel"
                                                      data-id="${data[i].user_user_id}"
                                                >已关注</button>
                                          </div>
                                    </div>
                              </div>
                        `
                        $('.my_following .follower_items').append(nodes)
                  }
            }

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/user/follow/getFollowings",
                  dataType: "json",
                  data: {
                        page: _that.current_page_following + 1,
                        perpage: "6"
                  },
                  success: function (response) {
                        if (response.data.length !== 0) {
                              updateFollowingItems(response.data)
                              _that.resetIframeHeight()
                              _that.current_page_following = _that.current_page_following + 1
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
      handleClickFollowingLoadMore: function () {
            const _that = this

            $('.my_following .btn_loadmore').on('click', function () {
                  _that.loadMoreFollowing()
            })
      },
})