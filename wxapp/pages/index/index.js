const app = getApp()

Page({
      data: {
            navigate_data: {
                  name: "title"
            },
            is_toptips_show: true,
            artical_items: {},
            category: '',
            active_category: '',
            active_category_recommend: '',
            is_login_show: false,
            height: '',
            curr_page: 1,
            user_status: '',
            is_sharing: false,
            share_info: {
                  id: '',
                  title: '',
                  cover: ''
            }
      },
      onLoad: function () {
            const _that = this;

            _that.justLogin();

            _that.timerHideToptips();

            _that.getHeight();

            _that.getUserStatus();

            _that.getAppTitle();

            //获取顶部导航类目
            _that.getCategory();
      },
      justLogin: function () {
            wx.getSetting({
                  success(res) {
                        if (res.authSetting['scope.userInfo']) {
                              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                              wx.getUserInfo({
                                    success(res) {
                                          console.log(res.userInfo)
                                          app.userLogin(res.userInfo, function () {})
                                    }
                              })
                        }
                  }
            })
      },
      getAppTitle: function () {
            const _that = this

            const app_title = wx.getStorage({
                  key: 'app_title'
            })

            if (!app_title) {
                  app.xpm.api('/xpmsns/pages/Siteconf/get')()
                        .get({
                              site_slug: 'global',
                              select: 'site_slogen'
                        })
                        .then((data) => {
                              wx.setStorage({
                                    key: 'app_title',
                                    data: data.site_slogen
                              })

                              _that.setData({
                                    'navigate_data.name': data.site_slogen
                              })
                        })
                        .catch(function (error) {
                              console.log(error);
                        })
            } else {
                  _that.setData({
                        'navigate_data.name': data.site_slogen
                  })
            }
      },
      getUserStatus: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user/User/getUserInfo')()
                  .get()
                  .then((data) => {
                        if (data.user_id) {
                              app.global_data.is_login_show = false;
                              _that.getRecommend();
                        } else {
                              app.global_data.is_login_show = true;
                              _that.changeLoginPop();
                        }
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      timerHideToptips: function () {
            setTimeout(() => {
                  this.setData({
                        is_toptips_show: false
                  })
            }, 10000)
      },
      handleTapToptips: function () {
            this.setData({
                  is_toptips_show: false
            })
      },
      getHeight: function () {
            //获取页面高度
            wx.getSystemInfo({
                  success: (res) => {
                        this.setData({
                              height: res.windowHeight
                        })
                  }
            })
      },
      getCategory: function (successCallback) {
            const _that = this;

            app.xpm.api('/xpmsns/pages/Category/search')()
                  .get({
                        iswxappnav: 1,
                        order: 'priority asc'
                  })
                  .then((data) => {
                        _that.setData({
                              category: data.data
                        });
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getRecommend: function () {
            const _that = this;

            //重置page
            _that.setData({
                  curr_page: 1
            })

            app.xpm.api('/xpmsns/pages/recommend/getContents')()
                  .get({
                        slugs: 'weekly_hotnews',
                        withfavorite: 1
                  })
                  .then((data) => {
                        _that.setData({
                              active_category: '推荐',
                              active_category_recommend: 'index_recommend',
                              artical_items: data.data
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      handleTapCategory: function (e) {
            const _that = this;

            //重置page
            _that.setData({
                  curr_page: 1
            })

            app.xpm.api('/xpmsns/pages/Article/search')()
                  .get({
                        perpage: 12,
                        categories: e.currentTarget.dataset.type,
                        withfavorite: 1
                  })
                  .then((data) => {
                        _that.setData({
                              active_category: e.currentTarget.dataset.type,
                              active_category_recommend: `${e.currentTarget.dataset.slug}_recommend`,
                              artical_items: data.data
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      handleTapCollection: function () {
            wx.navigateTo({
                  url: '/pages/collection/collection'
            })
      },
      handleTapCollect: function (e) {
            const _that = this;

            if (e.currentTarget.dataset.favoriteid) {
                  app.xpm.api('/xpmsns/user/Favorite/remove')()
                        .post({
                              favorite_id: e.currentTarget.dataset.favoriteid
                        })
                        .then((data) => {
                              wx.showToast({
                                    title: data.message,
                                    icon: 'none'
                              })

                              _that.data.artical_items[e.currentTarget.dataset.index].favorite = {};
                              _that.setData({
                                    artical_items: _that.data.artical_items
                              })
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            } else {
                  app.xpm.api('/xpmsns/user/Favorite/create')()
                        .post({
                              outer_id: e.currentTarget.dataset.id,
                              origin: 'article',
                              title: e.currentTarget.dataset.title
                        })
                        .then((data) => {
                              if (data._id) {
                                    wx.showToast({
                                          title: '收藏成功',
                                          icon: 'none'
                                    })

                                    _that.data.artical_items[e.currentTarget.dataset.index].favorite = data;
                                    _that.setData({
                                          artical_items: _that.data.artical_items
                                    })
                              }
                        })
                        .catch(function (error) {
                              wx.showToast({
                                    title: error.message,
                                    icon: 'none'
                              })
                        });
            }
      },
      handleTapArtical: function (e) {
            wx.navigateTo({
                  url: `/pages/artical/artical?article_id=${e.currentTarget.dataset.id}`
            })
      },
      closeApp: function () {
            wx.navigateBack({
                  delta: -1
            })
      },
      changeLoginPop: function () {
            this.setData({
                  is_login_show: app.global_data.is_login_show
            })
      },
      updateUserStatus: function () {
            const _that = this;

            if (_that.data.user_status) {
                  app.global_data.user_info.extra = JSON.stringify({
                        "user_status": _that.data.user_status
                  });
                  app.xpm.api('/xpmsns/user/User/updateProfile')()
                        .post(app.global_data.user_info)
                        .then((data) => {
                              const user_info = data.user_info;

                              for (var field in user_info) {
                                    app.xpm.require('user').set(field, user_info[field]);
                              }
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            }
      },
      bindGetUserInfo: function (e) {
            const _that = this;

            app.userLogin(e.detail, function () {
                  _that.changeLoginPop();
                  _that.updateUserStatus();
                  _that.getRecommend();

                  setTimeout(() => {
                        wx.showToast({
                              title: `到任务页面领取任务之后才能够获得积分哦`,
                              icon: 'none',
                              duration: 5000
                        })
                  }, 1000);
            });
      },
      navTo: function (e) {
            switch (e.currentTarget.dataset.type) {
                  case 'mall':
                        wx.navigateTo({
                              url: '/pages/mall/mall'
                        })
                        break;
                  case 'checkin':
                        wx.navigateTo({
                              url: '/pages/task/task'
                        })
                        break;
                  case 'travel':
                        wx.navigateTo({
                              url: '/pages/mall/mall'
                        })
                        break;
                  case 'safety':
                        wx.navigateTo({
                              url: '/pages/mall/mall'
                        })
                        break;
            }
      },
      closeShareWindow: function () {
            this.setData({
                  is_sharing: false
            })
      },
      openShareWindow: function (e) {
            const _that = this;

            _that.setData({
                  is_sharing: true,
                  share_info: {
                        id: e.target.dataset.id,
                        title: e.target.dataset.title,
                        cover: e.target.dataset.coverurl
                  }
            })
      },
      onShareAppMessage: function (e) {
            const _that = this;

            setTimeout(() => {
                  _that.setData({
                        is_sharing: false
                  })
            }, 1000);

            if (e.from === 'menu') {
                  return {
                        title: _that.data.navigate_data.name,
                        path: '/page/index/index'
                  }
            }

            return {
                  title: _that.data.share_info.title !== '' ? _that.data.share_info.title : '看好文，获积分，换奖品',
                  path: _that.data.share_info.id !== '' ? `/pages/artical/artical?article_id=${_that.data.share_info.id}` : '/pages/guide/guide',
                  imageUrl: _that.data.share_info.cover !== '' ? _that.data.share_info.cover : '../../images/pictrue_goods_eg.png'
            }
      },
      showMore: function () {
            const _that = this;

            wx.showLoading();

            function getMoreCategory(type) {
                  app.xpm.api('/xpmsns/pages/Article/search')()
                        .get({
                              perpage: 12,
                              page: _that.data.curr_page + 1,
                              categories: type,
                              withfavorite: 1
                        })
                        .then((data) => {
                              setTimeout(() => {
                                    wx.hideLoading();
                              }, 300)

                              _that.setData({
                                    artical_items: _that.data.artical_items.concat(data.data),
                                    curr_page: _that.data.curr_page + 1
                              })
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            }

            switch (_that.data.active_category) {
                  case '推荐':
                        wx.hideLoading();
                        break;
                  case '收藏':
                        wx.hideLoading();
                        break;
                  default:
                        getMoreCategory(_that.data.active_category);
                        break;
            }
      },
})