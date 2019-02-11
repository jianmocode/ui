let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this;

            _that.handleClickAsk();
            _that.handleClickHideAsk();
            _that.handleClickAddTags();
            _that.handleUnfocusTagsInput();
            _that.handleKeydownTagsInput();
            _that.handleClickBtnDeleteTag();
            _that.handleClickPublish();
      },
      showAskModal: function () {
            $('.ask_wrap')
                  .fadeIn()
                  .css({
                        'display': 'flex',
                        'justify-content': 'center',
                        'align-items': 'center'
                  });
            $('body').css('overflow', 'hidden');
      },
      hideAskModal: function () {
            $('.ask_wrap').fadeOut();
            $('body').css('overflow', 'auto');
      },
      handleClickAsk: function () {
            const _that = this;

            $('.ask').on('click', function () {
                  _that.showAskModal();
            })
      },
      handleClickHideAsk: function () {
            const _that = this;

            $('.btn_delete_modal').on('click', function () {
                  _that.hideAskModal();
            })
      },
      handleClickAddTags: function () {
            $('.add_topic_wrap').on('click', function () {
                  $(this).hide()
                  $('.topic_text').val('')
                  $('.topic_text_wrap').css('display', 'flex')
            })
      },
      handleUnfocusTagsInput: function () {
            $('.topic_text').blur(function () {
                  $(this)
                        .parent()
                        .hide()

                  let tagsNum = $('.topic_items').children('.topic_item').length;

                  if (tagsNum < 5) {
                        $('.add_topic_wrap').show()
                  }
            })
      },
      handleKeydownTagsInput: function () {
            $('.topic_text').keydown(function (e) {
                  if ($(this).val() && e.which === 13) {
                        $('.topic_items').css('display', 'flex')

                        let tagNodes = `
                              <div class="topic_item uk-flex uk-flex-middle">
                                    <a class="topic_item_text">${$(this).val()}</a>
                                    <span class="btn_delete"></span>
                              </div>
                        `
                        $('.topic_items').append(tagNodes)

                        let tagsNum = $('.topic_items').children('.topic_item').length;
                        $('.topic_text_wrap').hide()
                        $('.btn_add_topic').text(`添加话题 (${tagsNum}/5)`)
                        if (tagsNum < 5) {
                              $('.add_topic_wrap').show()
                        }

                        return false;
                  }
            })
      },
      handleClickBtnDeleteTag: function () {
            $('.topic_items').on('click', '.btn_delete', function (e) {
                  $(this)
                        .parent()
                        .remove()

                  let tagsNum = $('.topic_items').children('.topic_item').length;
                  $('.btn_add_topic').text(`添加话题 (${tagsNum}/5)`)

                  if (tagsNum < 5) {
                        $('.add_topic_wrap').show()
                        if (tagsNum === 0) {
                              $('.topic_items').hide()
                        }
                  }
            })
      },
      submitAskForm: function () {
            let tags = ''
            let tags_array=[]

            for (let i = 0; i < $('.topic_item_text').length; i++) {
                  tags_array[i] = $('.topic_item_text').eq(i).text()
            }

            tags = tags_array.join()
            
            let ask_form_data=`${$('#ask_form').serialize()}&tags=${tags}`
            $.ajax({
                  type: "post",
                  url: "/_api/xpmsns/qanda/question/create",
                  dataType: "json",
                  data: ask_form_data,
                  success: function (response) {
                        if (response._id) {
                              UIkit.notification({
                                    message: '提问成功',
                                    status: 'success',
                                    pos: 'bottom-right'
                              });

                              setTimeout(() => {
                                    // window.location.href = `/qanda/detail/${response.question_id}`;
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
      handleClickPublish: function () {
            const _that = this;

            let isValidated = false;

            $('.btn_publish').on('click', function () {

                  if ($('.question_title').val()) {
                        isValidated = true;
                  } else {
                        UIkit.notification({
                              message: '请输入问题标题',
                              status: 'warning',
                              pos: 'bottom-right'
                        })
                  }

                  if (isValidated) {
                        _that.submitAskForm();
                  }
            })
      }
})