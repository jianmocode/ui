/**
 * @俊杰 代码优化:
 *   1. 本页函数需要填写注释
 *   2. 建议增加 callback 函数，处理 Ajax 结果反馈
 *   3. 合并 follow & mobileFollow  等...
 * 
 */
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

function showMessage(text) {
      const _el = $('.mask_wrap')

      _el
            .find('.text')
            .text(text)

      _el.stop()
      _el.fadeIn()

      setTimeout(function () {
            _el.fadeOut()
      }, 2000)
}

function mobileFollow(user_id) {
      $.ajax({
            type: "post",
            url: "/_api/xpmsns/user/follow/follow",
            dataType: "json",
            data: {
                  user_id: user_id
            },
            success: function (response) {
                  if (response._id) {
                        showMessage('关注成功')
                  } else {
                        showMessage(response.message)
                  }
            },
            error: function (err) {
                  console.log(err)
            }
      })
}

function mobileUnfollow(user_id) {
      $.ajax({
            type: "post",
            url: "/_api/xpmsns/user/follow/unfollow",
            dataType: "json",
            data: {
                  user_id: user_id
            },
            success: function (response) {
                  if (response.code === 0) {
                        showMessage('取消关注成功')
                  } else {
                        showMessage(response.message)
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

//移动端触底检测函数
function isMobileScrollToBottom() {
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

      return getScrollTop() + getClientHeight() + 100 >= getScrollHeight()
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

//设置cookie
function setCookie(cookie_name, value, expiredays) {
      const exdate = new Date()

      exdate.setDate(exdate.getDate() + expiredays)

      document.cookie = cookie_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/"
}

//获取cookie
function getCookie(cookie_name) {
      if (document.cookie.length > 0) {
            let cookie_start = document.cookie.indexOf(cookie_name + "=")
            if (cookie_start != -1) {
                  cookie_start = cookie_start + cookie_name.length + 1
                  let cookie_end = document.cookie.indexOf(";", cookie_start)

                  if (cookie_end == -1) {
                        cookie_end = document.cookie.length
                  }
                  return unescape(document.cookie.substring(cookie_start, cookie_end))
            }
      }
      return ""
}

export {
      follow,
      unfollow,
      mobileFollow,
      mobileUnfollow,
      showMessage,
      isScrollToBottom,
      isMobileScrollToBottom,
      debounce,
      setCookie,
      getCookie
}