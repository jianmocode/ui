const app = getApp()

Page({
      data: {
            is_login: true
      },
      onLoad: function () {
            const _that = this;

            _that.isLogin();
      },
      handleTapUserStatus: function (e) {
            const _that = this;

            switch (e.target.dataset.type) {
                  case '我在备孕中':
                        _that.handleTapSkip('备孕中');
                        break;
                  case '怀孕中':
                        _that.handleTapSkip(`预产期：${e.detail.value}`);
                        break;
                  case '宝宝已出生':
                        _that.handleTapSkip(`宝宝生日：${e.detail.value}`);
                        break;
            }
      },
      handleTapSkip: function (status) {
            let status_type = typeof status;
            if (status_type === 'string') {
                  wx.redirectTo({
                        url: `/pages/index/index?status=${status}`
                  })
            } else {
                  wx.redirectTo({
                        url: `/pages/index/index`
                  })
            }
      },
      navToIndex: function () {
            wx.redirectTo({
                  url: `/pages/index/index`
            })
      },
      isLogin: function () {
            const _that = this;

            wx.showLoading({
                  title:'努力加载中'
            });

            wx.getSetting({
                  success: res => {
                        if (res.authSetting['scope.userInfo']) {
                              wx.hideLoading();

                              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                              _that.navToIndex();
                        } else {
                              wx.hideLoading();

                              _that.setData({
                                    is_login: false
                              })
                        }
                  }
            })
      }
})