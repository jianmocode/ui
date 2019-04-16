import {
      mobileFollow,
      mobileUnfollow,
      autoTextarea,
      publishComment,
      searchComment
} from '../../services/service'

import {
      message
} from '../../services/kit'

let web = getWeb();

Page({
      data: {},
      has_load_all_comment: false,
      has_load_all_reply: false,
      current_comment_page: 1,
      current_reply_page: 1,
      current: 'normal',
      onReady: function () {
            const _that = this

            window.onscroll = function () {
                  console.log(123);
            }

            _that.listenHeaderHeight()
            _that.handleClickBtnBack()
            _that.handleClickAnswerAgree()
            _that.handleClickFollowAnswerPerson()
            _that.handleClickUnfollowAnswerPerson()
            _that.setTextArea()
            _that.handleClickBtnComment()
            _that.handleClickBtnCloseComment()
            _that.handleClickBtnSubmitComment()
            _that.handleClickBtnCommentSecondFloor()
            _that.handleClickBtnCloseCommentSecondFloor()
            _that.handleClickBtnSubmitCommentSecondFloor()
            _that.handleClickBtnLoadMoreComment()
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
      listenHeaderHeight: function () {
            $('.answer_content_wrap').css('margin-top', $('.answer_header').height())
      },
      handleClickBtnBack: function () {
            $('.btn_back').on('click', function () {
                  window.history.go(-1)
            })
      },
      createAgree: function (data) {
            const _that = this

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/create",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      removeAgree: function (data) {
            const _that = this

            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/remove",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
                              _that.showMessage(response.message)
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      handleClickAnswerAgree: function () {
            const _that = this;

            $('.options_wrap').on('click', '.btn_agree', function () {
                  $(this).hide();
                  $(this)
                        .parents('.options_wrap')
                        .find('.btn_agree_clicked')
                        .css('display', 'flex')

                  _that.createAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })

            $('.options_wrap').on('click', '.btn_agree_clicked', function () {
                  $(this).hide();
                  $(this)
                        .parents('.options_wrap')
                        .find('.btn_agree')
                        .css('display', 'flex')

                  _that.removeAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })
      },
      handleClickFollowAnswerPerson: function () {
            $('.author_wrap').on('click', '.btn_follow', function () {
                  mobileFollow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_wrap')
                        .find('.btn_unfollow_real')
                        .show()
            })
      },
      handleClickUnfollowAnswerPerson: function () {
            $('.author_wrap').on('click', '.btn_unfollow', function () {
                  mobileUnfollow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_wrap')
                        .find('.btn_follow_real')
                        .show()
            })
      },
      setTextArea: function () {
            autoTextarea(document.getElementById("textarea_comment"))
            autoTextarea(document.getElementById("textarea_comment_second"))
      },
      handleClickBtnComment: function () {
            const _that = this

            $('.btn_comment').on('click', function () {
                  let data = {
                        outer_id: _that.data.answer_id
                  }

                  $('.comment_wrap .comment_content').html('')

                  searchComment(data, function (response) {
                        $('.comment_wrap .comment_count').html(`(${response.total})`)

                        if (response.data.length) {
                              response.data.map(function (item) {
                                    let name = item.user_nickname ? item.user_nickname : '佚名'
                                    let assets_path = '/static-file/default/mobile/assets'
                                    let avatar = item.user_headimgurl ? item.user_headimgurl.url : '/static-file/default/mobile/assets/images/icon_avatar.svg'

                                    let nodes = `
                                          <div 
                                                class="comment_item uk-flex uk-flex-between"
                                                data-id="${item.comment_id}"
                                                data-uid="${item.user_id}"
                                                data-rid="${item.reply_id}"
                                          >
                                                <div class="left">
                                                      <img
                                                            class="img_avatar"
                                                            src="${avatar}"
                                                            alt="img_avatar"
                                                      >
                                                </div>
                                                <div class="right uk-flex uk-flex-column">
                                                      <span class="name">${name}</span>
                                                      <span class="content_text">${item.mobile}</span>
                                                      <div class="options uk-flex uk-flex-between uk-flex-middle">
                                                            <div class="the_left">
                                                                  <span class="publish_time">${item.created_at}</span>
                                                            </div>
                                                            <div class="the_right">
                                                                  <img
                                                                        class="icon_comment"
                                                                        src="${assets_path}/images/icon_comment_line.svg"
                                                                        alt="icon_comment"
                                                                  >
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    `

                                    $('.comment_wrap .comment_content').append(nodes)
                              })
                        } else {
                              $('.btn_loadmore_comment').hide()
                        }
                  })

                  $('.comment_wrap').css('transform', 'translateY(0)')
            })
      },
      handleClickBtnCloseComment: function () {
            const _that = this


            $('.comment_wrap .img_close').on('click', function () {
                  $('.comment_wrap').css('transform', 'translateY(100vh)')
            })
      },
      handleClickBtnSubmitComment: function () {
            const _that = this

            $('.comment_wrap .btn_publish_comment').on('click', function () {
                  if ($('#textarea_comment').val()) {
                        let data = {
                              outer_id: 'qanda_' + _that.data.answer_id,
                              content: $('#textarea_comment').val()
                        }

                        publishComment(data)
                  } else {
                        message.error('评论不能为空')
                  }
            })
      },
      handleClickBtnCommentSecondFloor: function () {
            const _that = this

            $(document).on('click', '.icon_comment', function () {
                  let parent = $(this).parents('.comment_item')
                  let cid = parent.data('id')
                  let uid = parent.data('uid')
                  let rid = parent.data('rid')
                  let avatar = parent.find('.img_avatar').attr('src')
                  let name = parent.find('.name').text()
                  let content = parent.find('.content_text').html()
                  let create_at = parent.find('.publish_time').text()

                  let nodes = `
                        <div 
                              class="comment_item uk-flex uk-flex-between" 
                              data-cid="${cid}"
                              data-uid="${uid}"
                              data-rid="${rid}"
                        >
                              <div class="left">
                                    <img
                                          class="img_avatar"
                                          src="${avatar}"
                                          alt="img_avatar"
                                    >
                              </div>
                              <div class="right uk-flex uk-flex-column">
                                    <span class="name">${name}</span>
                                    <span class="content_text">${content}</span>
                                    <div class="options uk-flex uk-flex-middle">
                                          <div class="the_left">
                                                <span class="publish_time">${create_at}</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  `

                  $('.comment_detail_wrap .subject').html(nodes)

                  let data = {
                        comment_id: cid,
                        reply_id: rid
                  }

                  $('.comment_detail_wrap .reply_count .count').text('0条回复')
                  $('.comment_detail_wrap .comment_content').html('')

                  searchComment(data, function (response) {
                        if (response.data[0].replies) {
                              $('.comment_detail_wrap .reply_count .count').text(`${response.data[0].replies.length}条回复`)

                              response.data[0].replies.map(function (item) {
                                    let _name = item.nickname ? item.nickname : '佚名'
                                    let _avatar = item.headimgurl ? item.headimgurl.url : '/static-file/default/mobile/assets/images/icon_avatar.svg'

                                    let nodes = `
                                          <div 
                                                class="comment_item uk-flex uk-flex-between"
                                                data-id="${item.comment_id}"
                                                data-uid="${item.user_id}"
                                          >
                                                <div class="left">
                                                      <img
                                                            class="img_avatar"
                                                            src="${_avatar}"
                                                            alt="img_avatar"
                                                      >
                                                </div>
                                                <div class="right uk-flex uk-flex-column">
                                                      <span class="name">${_name}</span>
                                                      <span class="content_text">${item.mobile}</span>
                                                      <div class="options uk-flex uk-flex-between uk-flex-middle">
                                                            <div class="the_left">
                                                                  <span class="publish_time">${item.created_at}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    `

                                    $('.comment_detail_wrap .comment_content').append(nodes)
                              })
                        } else {
                              $('.btn_loadmore_reply').hide()
                        }
                  })

                  $('.comment_detail_wrap').css('transform', 'translateY(0)')

                  $('.btn_loadmore_reply').on('click', function () {
                        if (!_that.has_load_all_reply) {
                              let data = {
                                    comment_id: cid,
                                    reply_id: rid,
                                    page: _that.current_reply_page + 1
                              }

                              searchComment(data, function (response) {
                                    if (response.data.length) {
                                          _that.current_reply_page = _that.current_reply_page + 1

                                          response.data[0].replies.map(function (item) {
                                                let _name = item.nickname ? item.nickname : '佚名'
                                                let _avatar = item.headimgurl ? item.headimgurl.url : '/static-file/default/mobile/assets/images/icon_avatar.svg'

                                                let nodes = `
                                                      <div 
                                                            class="comment_item uk-flex uk-flex-between"
                                                            data-id="${item.comment_id}"
                                                            data-uid="${item.user_id}"
                                                      >
                                                            <div class="left">
                                                                  <img
                                                                        class="img_avatar"
                                                                        src="${_avatar}"
                                                                        alt="img_avatar"
                                                                  >
                                                            </div>
                                                            <div class="right uk-flex uk-flex-column">
                                                                  <span class="name">${_name}</span>
                                                                  <span class="content_text">${item.mobile}</span>
                                                                  <div class="options uk-flex uk-flex-between uk-flex-middle">
                                                                        <div class="the_left">
                                                                              <span class="publish_time">${item.created_at}</span>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                `

                                                $('.comment_detail_wrap .comment_content').append(nodes)
                                          })
                                    } else {
                                          _that.has_load_all_reply = true
                                          message.warn('没有更多了')
                                    }
                              })
                        }
                  })
            })
      },
      handleClickBtnCloseCommentSecondFloor: function () {
            const _that = this

            $('.comment_detail_wrap .img_close').on('click', function () {
                  $('.comment_detail_wrap').css('transform', 'translateY(100vh)')
            })
      },
      handleClickBtnSubmitCommentSecondFloor: function () {
            const _that = this

            $('.comment_detail_wrap .btn_publish_comment').on('click', function () {
                  if ($('#textarea_comment_second').val()) {
                        let data = {
                              outer_id: _that.data.answer_id,
                              reply_id: $(this).parents('.comment_detail_wrap').find('.subject .comment_item').data('cid'),
                              reply_user_id: $(this).parents('.comment_detail_wrap').find('.subject .comment_item').data('uid'),
                              content: $('#textarea_comment_second').val()
                        }

                        publishComment(data)
                  } else {
                        message.error('回复不能为空')
                  }
            })
      },
      handleClickBtnLoadMoreComment: function () {
            const _that = this

            $('.btn_loadmore_comment').on('click', function () {
                  if (!_that.has_load_all_comment) {
                        let data = {
                              outer_id: _that.data.answer_id,
                              page: _that.current_comment_page + 1
                        }

                        searchComment(data, function (response) {
                              if (response.data.length) {
                                    _that.current_comment_page = _that.current_comment_page + 1

                                    response.data.map(function (item) {
                                          let name = item.user_nickname ? item.user_nickname : '佚名'
                                          let assets_path = '/static-file/default/mobile/assets'
                                          let avatar = item.user_headimgurl ? item.user_headimgurl.url : '/static-file/default/mobile/assets/images/icon_avatar.svg'

                                          let nodes = `
                                                <div 
                                                      class="comment_item uk-flex uk-flex-between"
                                                      data-id="${item.comment_id}"
                                                      data-uid="${item.user_id}"
                                                      data-rid="${item.reply_id}"
                                                >
                                                      <div class="left">
                                                            <img
                                                                  class="img_avatar"
                                                                  src="${avatar}"
                                                                  alt="img_avatar"
                                                            >
                                                      </div>
                                                      <div class="right uk-flex uk-flex-column">
                                                            <span class="name">${name}</span>
                                                            <span class="content_text">${item.mobile}</span>
                                                            <div class="options uk-flex uk-flex-between uk-flex-middle">
                                                                  <div class="the_left">
                                                                        <span class="publish_time">${item.created_at}</span>
                                                                  </div>
                                                                  <div class="the_right">
                                                                        <img
                                                                              class="icon_comment"
                                                                              src="${assets_path}/images/icon_comment_line.svg"
                                                                              alt="icon_comment"
                                                                        >
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          `

                                          $('.comment_wrap .comment_content').append(nodes)
                                    })
                              } else {
                                    _that.has_load_all_comment = true
                                    message.warn('没有更多了')
                              }
                        })
                  }
            })
      }
})