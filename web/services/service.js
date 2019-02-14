function follow(user_id) {
      $.ajax({
            type: "post",
            url: "/_api/xpmsns/user/follow/follow",
            dataType: "json",
            data: {
                  user_id: user_id
            },
            success: function (response) {
                  if (response._id) {
                        UIkit.notification({
                              message: '关注成功',
                              status: 'success',
                              pos: 'bottom-right'
                        })
                  } else {
                        UIkit.notification({
                              message: response.message,
                              status: 'danger',
                              pos: 'bottom-right'
                        })
                  }
            },
            error: function (err) {
                  console.log(err)
            }
      })
}

function unfollow(user_id) {
      $.ajax({
            type: "post",
            url: "/_api/xpmsns/user/follow/unfollow",
            dataType: "json",
            data: {
                  user_id: user_id
            },
            success: function (response) {
                  if (response._id) {
                        UIkit.notification({
                              message: '取消关注成功',
                              status: 'success',
                              pos: 'bottom-right'
                        })
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
}

//触底检测函数
function isScrollToBottom() {
      //获取滑动的高度
      function getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                  scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                  scrollTop = document.body.scrollTop;
            }
            return scrollTop;
      }
      //获取当前可视范围的高度
      function getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                  clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                  clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
      }
      //获取文档完整的高度 
      function getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      }

      return getScrollTop() + getClientHeight() + 250 >= getScrollHeight()
}

//防抖函数
function debounce(method, delay) {
      let timer = null;
      return function () {
            let self = this,
                  args = arguments;
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                  method.apply(self, args);
            }, delay);
      }
}

export {
      follow,
      unfollow,
      isScrollToBottom,
      debounce
}