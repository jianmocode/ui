import {
      follow,
      unfollow
} from '../../../services/service';

let web = getWeb();

Page({
      data: {},
      onReady: function () {
            const _that = this;

            _that.handleClickTabLick();
            _that.handleHoverCancelFollow();
            _that.handleClickFollow();
            _that.handleClickCancelFollow();
      },
      handleClickTabLick: function () {
            function resetTab() {
                  $('.content_item').hide()
                  $('.tab_link').removeClass('is_active')
            }

            function resetIframeHeight() {
                  $(window.parent.document)
                        .find(".iframe iframe")
                        .height($('.zhifou_wrap').height())
            }

            $('.tab_link').on('click', function () {
                  switch (this.dataset.link) {
                        case 'my_questions':
                              resetTab()
                              $('.my_questions').css('display', 'flex')
                              $('.tab_link_questions').addClass('is_active')
                              break;
                        case 'my_answers':
                              resetTab()
                              $('.my_answers').css('display', 'flex')
                              $('.tab_link_answers').addClass('is_active')
                              break;
                        case 'my_followers':
                              resetTab()
                              $('.my_followers').css('display', 'flex')
                              $('.tab_link_followers').addClass('is_active')
                              break;
                        case 'my_following':
                              resetTab()
                              $('.my_following').css('display', 'flex')
                              $('.tab_link_following').addClass('is_active')
                              break;
                  }

                  resetIframeHeight()
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
      }
})