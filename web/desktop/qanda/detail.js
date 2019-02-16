import {
      follow,
      unfollow,
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


let web = getWeb();

Page({
      data: {},
      is_answer_input_show: false,
      current_page: 1,
      has_load_all: false,
      current_rank_type: 'default',
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
            _that.handleHoverUserAvatar();
            _that.handleClickQuestionShowAll();
            _that.handleClickAnswerShowAll();
            _that.handleClickWriteAnswer();
            _that.handleClickSubmitAnswer();
            _that.handleClickAnswerAgree();
            _that.listenQuestionSummaryHeight();
            _that.listenAnswersSummaryHeight();
            _that.handleClickFollowAnswerPerson();
            _that.handleHoverUnfollowAnswerPerson();
            _that.handleClickUnfollowAnswerPerson();
            _that.listenScrollPositioningRightAndLoadMore();
            _that.handleClickBtnRankAnswers();
      },
      handleHoverUserAvatar: function () {
            const _that = this;

            $('.answer_items').on("mouseover mouseout", '.answer_item .user_info', function (event) {
                  if (event.type == "mouseover") {
                        $(this)
                              .parent()
                              .find('.author_content')
                              .show()
                              .addClass('uk-flex uk-flex-column');
                  } else if (event.type == "mouseout") {
                        $(this)
                              .parent()
                              .find('.author_content')
                              .hide();

                        $(this)
                              .parent()
                              .find('.author_content').hover(
                                    function () {
                                          $(this)
                                                .show()
                                                .addClass('uk-flex uk-flex-column');
                                    },
                                    function () {
                                          $(this)
                                                .hide();
                                    }
                              )
                  }
            })
      },
      handleClickQuestionShowAll: function () {
            const _that = this;

            $('.btn_show_all_question').on('click', function () {
                  $(this)
                        .hide();

                  $('.btn_collapse_question').show()

                  $(this)
                        .parents('.question')
                        .find('.question_summary')
                        .hide();

                  $(this)
                        .parents('.question')
                        .find('.question_detail')
                        .show();
            })

            $('.btn_collapse_question').on('click', function () {
                  $(this)
                        .hide();

                  $('.btn_show_all_question').show()

                  $(this)
                        .parents('.question')
                        .find('.question_summary')
                        .show();

                  $(this)
                        .parents('.question')
                        .find('.question_detail')
                        .hide();
            })
      },
      handleClickAnswerShowAll: function () {
            const _that = this;

            $('.answer_items').on('click', '.btn_show_all_answer', function () {
                  $(this)
                        .hide();

                  $(this)
                        .parent()
                        .css('height', 'auto');

                  $(this)
                        .parent()
                        .parent()
                        .find('.btn_collapse_answer')
                        .show();
            })

            $('.answer_items').on('click', '.btn_collapse_answer', function () {
                  $(this)
                        .hide();

                  $(this)
                        .parents('.answer_item')
                        .find('.answer_content')
                        .css('height', '240px');

                  $(this)
                        .parents('.answer_item')
                        .find('.btn_show_all_answer')
                        .show();
            })
      },
      handleClickWriteAnswer: function () {
            const _that = this;

            $('.btn_write').on('click', function () {
                  if (_that.is_answer_input_show) {
                        $('.answer_input').slideUp();
                        $(this)
                              .find('.text')
                              .text('写回答');
                        _that.is_answer_input_show = false;
                  } else {
                        $('.answer_input').slideDown();
                        $(this)
                              .find('.text')
                              .text('不写了');
                        _that.is_answer_input_show = true;
                  }
            })
      },
      submitAnswerForm: function () {
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/answer/create",
                  dataType: "json",
                  data: $('#answer_form').serialize(),
                  success: function (response) {
                        if (response._id) {
                              UIkit.notification({
                                    message: '回答成功',
                                    status: 'success',
                                    pos: 'bottom-right'
                              });

                              setTimeout(() => {
                                    window.location.reload();
                              }, 1000);
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
            })
      },
      handleClickSubmitAnswer: function () {
            const _that = this;

            let isValidated = false;

            $('.btn_submit').on('click', function () {

                  if ($('.jm-editor-html #content_input').val()) {
                        isValidated = true;
                  } else {
                        UIkit.notification({
                              message: '请输入答案内容',
                              status: 'warning',
                              pos: 'bottom-right'
                        })
                  }

                  if (isValidated) {
                        _that.submitAnswerForm();
                  }
            })
      },
      createAgree: function (data) {
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/create",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
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
            })
      },
      removeAgree: function (data) {
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/remove",
                  dataType: "json",
                  data: data,
                  success: function (response) {
                        if (response._id) {} else {
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
            })
      },
      handleClickAnswerAgree: function () {
            const _that = this;

            $('.answer_items').on('click', '.btn_agree', function () {
                  $(this).hide();
                  $(this)
                        .parent()
                        .find('.btn_agree_clicked')
                        .css('display', 'flex')

                  _that.createAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })

            $('.answer_items').on('click', '.btn_agree_clicked', function () {
                  $(this).hide();
                  $(this)
                        .parent()
                        .find('.btn_agree')
                        .css('display', 'flex')

                  _that.removeAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  })
            })
      },
      listenQuestionSummaryHeight: function () {
            if ($('.question_summary').height() >= 21) {
                  $('.btn_show_all_question').css('display', 'inline-block')
                  $('.question_summary').text(`${$('.question_summary').text()}...`)
            }
      },
      listenAnswersSummaryHeight: function () {
            const _el = $('.answer_content_text')

            for (let i = 0; i < _el.length; i++) {
                  if (_el.eq(i).height() < 240) {
                        _el.eq(i)
                              .parent()
                              .css('height', 'auto')

                        _el.eq(i)
                              .parent()
                              .find('.btn_show_all_answer')
                              .hide()
                  }
            }
      },
      handleClickFollowAnswerPerson: function () {
            $('.answer_items').on('click', '.btn_follow', function () {
                  follow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_content')
                        .find('.btn_unfollow_real')
                        .show()
            })
      },
      handleHoverUnfollowAnswerPerson: function () {
            $('.answer_items').on('mouseover', '.btn_unfollow', function () {
                  $(this).text('取消关注')
            })
            $('.answer_items').on('mouseout', '.btn_unfollow', function () {
                  $(this).text('已关注')
            })
      },
      handleClickUnfollowAnswerPerson: function () {
            $('.answer_items').on('click', '.btn_unfollow', function () {
                  unfollow($(this).data('id'))

                  $(this).hide()

                  $(this)
                        .parents('.author_content')
                        .find('.btn_follow_real')
                        .show()
            })
      },
      loadMoreAnswers: function () {
            const _that = this

            function updateAnswersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let user_headimgurl = data[i].user_headimgurl ? data[i].user_headimgurl.url : '/static-file/default/desktop/assets/images/elephant.svg'
                        let nickname = data[i].user_nickname ? data[i].user_nickname : data[i].user_mobile
                        let bio = data[i].user_bio ? data[i].user_bio : 'TA还没有简介哦'
                        let user_answer_cnt = data[i].user_answer_cnt ? data[i].user_answer_cnt : '0'
                        let user_question_cnt = data[i].user_question_cnt ? data[i].user_question_cnt : '0'
                        let user_follower_cnt = data[i].user_follower_cnt ? data[i].user_follower_cnt : '0'
                        let relation_1 = data[i].relation === 'no-relation' ? 'block' : 'none'
                        let relation_2 = data[i].relation === 'follower' ? 'block' : 'none'
                        let relation_3 = data[i].relation === 'following' ? 'block' : 'none'
                        let relation_4 = data[i].relation === 'friend' ? 'block' : 'none'
                        let follow_state = data[i].user_user_id !== _that.data.user.user_id ? 'block' : 'none'
                        let has_agreed_state_1 = data[i].has_agreed ? 'none' : 'flex'
                        let has_agreed_state_2 = data[i].has_agreed ? 'flex' : 'none'

                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="answer_item"
                                    mp:key="${data[i].answer_id}"
                                    data-id="${data[i].answer_id}"
                              >
                                    <div class="author_content">
                                          <div class="author_info uk-flex uk-flex-between uk-flex-middle">
                                                <a
                                                      class="author_link"
                                                      href="#"
                                                >
                                                      <img
                                                            class="avatar_author"
                                                            src="${user_headimgurl}"
                                                            alt="avatar_author"
                                                      >
                                                </a>
                                                <div class="info uk-flex uk-flex-column">
                                                      <span class="nickname line_clamp_1">${nickname}</span>
                                                      <span class="intro line_clamp_1">${bio}</span>
                                                </div>
                                          </div>
                                          <div class="author_success uk-flex uk-flex-between">
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">回答</span>
                                                      <span class="value">${user_answer_cnt}</span>
                                                </a>
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">提问</span>
                                                      <span class="value">${user_question_cnt}</span>
                                                </a>
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">关注者</span>
                                                      <span class="value">${user_follower_cnt}</span>
                                                </a>
                                          </div>
                                          <div class="options ${follow_state}">
                                                <div
                                                      class="btn_follow btn_follow_real"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_1}"
                                                >
                                                      <span class="text">关注TA</span>
                                                </div>
                                                <div
                                                      class="btn_follow"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_2}"
                                                >
                                                      <span class="text">关注TA</span>
                                                </div>
                                                <div
                                                      class="btn_unfollow btn_unfollow_real"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_3}"
                                                >
                                                      <span class="text">已关注</span>
                                                </div>
                                                <div
                                                      class="btn_unfollow"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_4}"
                                                >
                                                      <span class="text">互相关注</span>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="user_info uk-flex">
                                          <img
                                                class="img_avatar"
                                                src="${user_headimgurl}"
                                                alt="img_avatar"
                                          >
                                          <div class="detail uk-flex uk-flex-column uk-flex-center">
                                                <span class="nickname line_clamp_1">${nickname}</span>
                                                <span class="intro line_clamp_1">${bio}</span>
                                          </div>
                                    </div>
                                    <div class="answer_content uk-flex uk-flex-column">
                                          <span class="answer_content_text">${data[i].content}</span>
                                          <div class="btn_show_all_answer uk-flex uk-flex-center uk-flex-middle">
                                                <span class="text">展开阅读全文</span>
                                                <img
                                                      class="icon_pull"
                                                      src="${asset_path}/images/icon_arrow_down_blue.png"
                                                      alt="icon_pull"
                                                >
                                          </div>
                                    </div>
                                    <div class="publish_time">
                                          <span>发布于 ${data[i].publish_time}</span>
                                    </div>
                                    <div class="options uk-flex uk-flex-between">
                                          <div class="left">
                                                <div
                                                      class="btn_agree uk-flex uk-flex-middle ${has_agreed_state_1}"
                                                      data-id="${data[i].answer_id}"
                                                >
                                                      <img 
                                                            class="img_agree"
                                                            src="${asset_path}/images/icon_agree.svg"
                                                            alt="icon_agree"
                                                      >
                                                      <span class="text">赞同</span>
                                                      <span class="count">${data[i].agree_cnt}</span>
                                                </div>
                                                <div
                                                      class="btn_agree_clicked uk-flex uk-flex-middle ${has_agreed_state_2}"
                                                      data-id="${data[i].answer_id}"
                                                >
                                                      <img
                                                            class="img_clap"
                                                            src="${asset_path}/images/icon_agree_white.svg"
                                                            alt="icon_clap"
                                                      >
                                                      <span class="text">已赞同</span>
                                                      <span class="count">${data[i].agree_cnt}</span>
                                                </div>
                                          </div>
                                          <div class="right">
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
                        perpage: "6",
                        answer_select: "answer.answer_id,answer.summary,answer.content,answer.agree_cnt,answer.publish_time,user.headimgurl,user.user_id,user.name,user.nickname,user.mobile,user.bio",
                        agree_desc: _that.current_rank_type === 'default' ? "1" : "",
                        publish_desc: _that.current_rank_type === 'time' ? "1" : ""
                  },
                  success: function (response) {
                        if (response.answers.data.length !== 0) {
                              updateAnswersItems(response.answers.data)
                              _that.listenAnswersSummaryHeight()
                              _that.current_page = _that.current_page + 1
                        } else {
                              _that.has_load_all = true
                              $('.loadmore_wrap').slideUp()

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
                  let right_up_height_1 = -($('.question_wrap').height() + 114)
                  let right_up_height_2 = $('.question_wrap').height() + 114

                  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                  if (scrollTop > right_up_height_2) {
                        $('.content_wrap .right_wrap').css({
                              'transform': `translateY(${right_up_height_1}px)`,
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
                        _that.loadMoreAnswers()
                        $('.loadmore_wrap').show()
                  }
            }, 200)
      },
      loadAnswers: function () {
            const _that = this

            $('.answer_items').html('')

            function updateAnswersItems(data) {
                  for (let i = 0; i < data.length; i++) {
                        let user_headimgurl = data[i].user_headimgurl ? data[i].user_headimgurl.url : '/static-file/default/desktop/assets/images/elephant.svg'
                        let nickname = data[i].user_nickname ? data[i].user_nickname : data[i].user_mobile
                        let bio = data[i].user_bio ? data[i].user_bio : 'TA还没有简介哦'
                        let user_answer_cnt = data[i].user_answer_cnt ? data[i].user_answer_cnt : '0'
                        let user_question_cnt = data[i].user_question_cnt ? data[i].user_question_cnt : '0'
                        let user_follower_cnt = data[i].user_follower_cnt ? data[i].user_follower_cnt : '0'
                        let relation_1 = data[i].relation === 'no-relation' ? 'block' : 'none'
                        let relation_2 = data[i].relation === 'follower' ? 'block' : 'none'
                        let relation_3 = data[i].relation === 'following' ? 'block' : 'none'
                        let relation_4 = data[i].relation === 'friend' ? 'block' : 'none'
                        let follow_state = data[i].user_user_id !== _that.data.user.user_id ? 'block' : 'none'
                        let has_agreed_state_1 = data[i].has_agreed ? 'none' : 'flex'
                        let has_agreed_state_2 = data[i].has_agreed ? 'flex' : 'none'

                        const asset_path = '/static-file/default/desktop/assets'

                        let nodes = `
                              <div
                                    class="answer_item"
                                    mp:key="${data[i].answer_id}"
                                    data-id="${data[i].answer_id}"
                              >
                                    <div class="author_content">
                                          <div class="author_info uk-flex uk-flex-between uk-flex-middle">
                                                <a
                                                      class="author_link"
                                                      href="#"
                                                >
                                                      <img
                                                            class="avatar_author"
                                                            src="${user_headimgurl}"
                                                            alt="avatar_author"
                                                      >
                                                </a>
                                                <div class="info uk-flex uk-flex-column">
                                                      <span class="nickname line_clamp_1">${nickname}</span>
                                                      <span class="intro line_clamp_1">${bio}</span>
                                                </div>
                                          </div>
                                          <div class="author_success uk-flex uk-flex-between">
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">回答</span>
                                                      <span class="value">${user_answer_cnt}</span>
                                                </a>
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">提问</span>
                                                      <span class="value">${user_question_cnt}</span>
                                                </a>
                                                <a class="success_item uk-flex uk-flex-column uk-flex-middle">
                                                      <span class="name">关注者</span>
                                                      <span class="value">${user_follower_cnt}</span>
                                                </a>
                                          </div>
                                          <div class="options ${follow_state}">
                                                <div
                                                      class="btn_follow btn_follow_real"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_1}"
                                                >
                                                      <span class="text">关注TA</span>
                                                </div>
                                                <div
                                                      class="btn_follow"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_2}"
                                                >
                                                      <span class="text">关注TA</span>
                                                </div>
                                                <div
                                                      class="btn_unfollow btn_unfollow_real"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_3}"
                                                >
                                                      <span class="text">已关注</span>
                                                </div>
                                                <div
                                                      class="btn_unfollow"
                                                      data-id="${data[i].user_user_id}"
                                                      style="display:${relation_4}"
                                                >
                                                      <span class="text">互相关注</span>
                                                </div>
                                          </div>
                                    </div>
                                    <div class="user_info uk-flex">
                                          <img
                                                class="img_avatar"
                                                src="${user_headimgurl}"
                                                alt="img_avatar"
                                          >
                                          <div class="detail uk-flex uk-flex-column uk-flex-center">
                                                <span class="nickname line_clamp_1">${nickname}</span>
                                                <span class="intro line_clamp_1">${bio}</span>
                                          </div>
                                    </div>
                                    <div class="answer_content uk-flex uk-flex-column">
                                          <span class="answer_content_text">${data[i].content}</span>
                                          <div class="btn_show_all_answer uk-flex uk-flex-center uk-flex-middle">
                                                <span class="text">展开阅读全文</span>
                                                <img
                                                      class="icon_pull"
                                                      src="${asset_path}/images/icon_arrow_down_blue.png"
                                                      alt="icon_pull"
                                                >
                                          </div>
                                    </div>
                                    <div class="publish_time">
                                          <span>发布于 ${data[i].publish_time}</span>
                                    </div>
                                    <div class="options uk-flex uk-flex-between">
                                          <div class="left">
                                                <div
                                                      class="btn_agree uk-flex uk-flex-middle ${has_agreed_state_1}"
                                                      data-id="${data[i].answer_id}"
                                                >
                                                      <img 
                                                            class="img_agree"
                                                            src="${asset_path}/images/icon_agree.svg"
                                                            alt="icon_agree"
                                                      >
                                                      <span class="text">赞同</span>
                                                      <span class="count">${data[i].agree_cnt}</span>
                                                </div>
                                                <div
                                                      class="btn_agree_clicked uk-flex uk-flex-middle ${has_agreed_state_2}"
                                                      data-id="${data[i].answer_id}"
                                                >
                                                      <img
                                                            class="img_clap"
                                                            src="${asset_path}/images/icon_agree_white.svg"
                                                            alt="icon_clap"
                                                      >
                                                      <span class="text">已赞同</span>
                                                      <span class="count">${data[i].agree_cnt}</span>
                                                </div>
                                          </div>
                                          <div class="right">
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
                        perpage: "6",
                        answer_select: "answer.answer_id,answer.summary,answer.content,answer.agree_cnt,answer.publish_time,user.headimgurl,user.user_id,user.name,user.nickname,user.mobile,user.bio",
                        agree_desc: _that.current_rank_type === 'default' ? "1" : "",
                        publish_desc: _that.current_rank_type === 'time' ? "1" : ""
                  },
                  success: function (response) {
                        if (response.answers.data.length !== 0) {
                              updateAnswersItems(response.answers.data)
                              _that.listenAnswersSummaryHeight()
                        }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            })
      },
      handleClickBtnRankAnswers: function () {
            const _that = this

            $('.btn_rank_as').on('click', function () {
                  _that.has_load_all = false

                  switch ($(this).data('type')) {
                        case 'default':
                              $(this)
                                    .parents('.answer_rank')
                                    .find('.btn_rank')
                                    .text('默认排序')

                              _that.current_rank_type = 'default'
                              _that.loadAnswers()
                              break
                        case 'time':
                              $(this)
                                    .parents('.answer_rank')
                                    .find('.btn_rank')
                                    .text('按时间排序')

                              _that.current_rank_type = 'time'
                              _that.loadAnswers()
                              break
                  }
            })
      }
})