let web = getWeb();

Page({
      data: {},
      is_answer_input_show: false,
      onReady: function () {
            const _that = this;

            _that.handleHoverUserAvatar();
            _that.handleClickQuestionShowAll();
            _that.handleClickAnswerShowAll();
            _that.handleClickWriteAnswer();
            _that.handleClickSubmitAnswer();
            _that.handleClickAnswerAgree();
      },
      handleHoverUserAvatar: function () {
            const _that = this;

            $('.answer_item .user_info').hover(
                  function () {
                        $(this)
                              .parent()
                              .find('.author_content')
                              .fadeIn()
                              .addClass('uk-flex uk-flex-column');
                  },
                  function () {
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
            )
      },
      handleClickQuestionShowAll: function () {
            const _that = this;

            $('.btn_show_all_question').on('click', function () {
                  $(this)
                        .parent()
                        .find('.question_summary')
                        .toggle();

                  $(this)
                        .parent()
                        .find('.question_detail')
                        .toggle();
            })
      },
      handleClickAnswerShowAll: function () {
            const _that = this;

            $('.btn_show_all_answer').on('click', function () {
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
            });

            $('.btn_collapse_answer').on('click', function () {
                  $(this)
                        .hide();

                  $(this)
                        .parents('.answer_content')
                        .css('height', '240px');
                  
                  $(this)
                        .parent()
                        .parent()
                        .parent()
                        .find('.btn_show_all_answer')
                        .show();
            });
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
            });
      },
      handleClickSubmitAnswer: function () {
            const _that = this;

            let isValidated = false;

            $('.btn_submit').on('click', function () {

                  if ($('.answer_content').val()) {
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
                        console.log(response);

                        // if (response._id) {
                        //       UIkit.notification({
                        //             message: '回答成功',
                        //             status: 'success',
                        //             pos: 'bottom-right'
                        //       });

                        //       setTimeout(() => {
                        //             window.location.reload();
                        //       }, 1000);
                        // } else {
                        //       UIkit.notification({
                        //             message: response.message,
                        //             status: 'danger',
                        //             pos: 'bottom-right'
                        //       })
                        // }
                  },
                  error: function (err) {
                        console.log(err);
                  }
            });
      },
      removeAgree: function () {
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/comment/agree/remove",
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
            });
      },
      handleClickAnswerAgree: function () {
            const _that = this;

            $('.btn_agree').on('click', function () {
                  $(this).hide();
                  $(this)
                        .parent()
                        .find('.btn_agree_clicked')
                        .show();

                  _that.createAgree({
                        outer_id: $(this).data('id'),
                        origin: 'answer'
                  });
            })

            $('.btn_agree_clicked').on('click', function () {
                  $(this).hide();
                  $(this)
                        .parent()
                        .find('.btn_agree')
                        .show();
            })
      }
})