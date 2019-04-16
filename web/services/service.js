import {
      message
} from './kit'

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

//textarea高度自适应
function autoTextarea(elem, extra, maxHeight) {
      extra = extra || 0;
      var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function (type, callback) {
                  elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ? function (name) {
                  var val = elem.currentStyle[name];

                  if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                              parseFloat(getStyle('paddingTop')) -
                              parseFloat(getStyle('paddingBottom')) + 'px';
                  };

                  return val;
            } : function (name) {
                  return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));

      elem.style.resize = 'none';

      var change = function () {
            var scrollTop, height,
                  padding = 0,
                  style = elem.style;

            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;

            if (!isFirefox && !isOpera) {
                  padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            };
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                  if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                  } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                  };
                  style.height = height + extra + 'px';
                  scrollTop += parseInt(style.height) - elem.currHeight;
                  document.body.scrollTop = scrollTop;
                  document.documentElement.scrollTop = scrollTop;
                  elem.currHeight = parseInt(style.height);
            };
      };

      addEvent('propertychange', change);
      addEvent('input', change);
      addEvent('focus', change);
      change();
}

//发布 评论
function publishComment(data, successCallback, errorCallback) {
      $.ajax({
            method: 'post',
            url: '/_api/xpmsns/comment/comment/create',
            dataType: 'json',
            data: data,
            success: function (response) {
                  if(response.code===400){
                        message.error(response.message)
                  } else {
                        message.success('发布成功')
                  }
            },
            error: function (err) {
                  if (errorCallback) {
                        errorCallback()
                  } else {
                        message.success('发布成功')
                  }
            }
      })
}

//查询 评论
function searchComment(data, successCallback, errorCallback) {
      $.ajax({
            method: 'get',
            url: '/_api/xpmsns/comment/comment/query',
            dataType: 'json',
            data: data,
            success: function (response) {
                  successCallback(response)
            },
            error: function (err) {
                  if (errorCallback) {
                        errorCallback()
                  } else {
                        message.error(err)
                  }
            }
      })
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
      getCookie,
      autoTextarea,
      publishComment,
      searchComment
}