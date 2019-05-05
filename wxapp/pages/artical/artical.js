const app = getApp()

Page({
    data: {
        navigate_data: {
            name: "文章详情"
        },
        artical_item: {},
        article_id: '',
        accepted_credits: 0,
        is_task_done: false,
        from: ''
    },
    onLoad: function(option) {
        const _that = this;

        wx.showShareMenu();

        _that.timerForSignup();

        wx.showLoading();

        _that.getArticle(option, function() {
            _that.getTaskStatus();
        });
    },
    timerForSignup: function() {
        const _that = this;
        setTimeout(() => {
            if (_that.data.from === 'share') {
                wx.showModal({
                    title: '提示',
                    content: '觉得内容不错，注册使用该小程序？',
                    showCancel: true,
                    confirmColor: '#f15e86',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/guide/guide'
                            })
                        } else if (res.cancel) {}
                    }
                })
            }
        }, 10000);
    },
    getArticle: function(option, callback) {
        const _that = this;

        app.xpm.api('/xpmsns/pages/Article/get')()
            .get({
                articleId: option.article_id
            })
            .then((data) => {
                wx.hideLoading();
                _that.setData({
                    artical_item: data,
                    article_id: option.article_id,
                    from: option.from ? 'share' : ''
                });
                callback();
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    getTaskStatus: function() {
        const _that = this;

        app.xpm.api('/xpmsns/user//Task/gettasks')()
            .get({
                slug: 'article-reading'
            })
            .then((data) => {
                if (data.data[0].usertask !== null) {
                    let quantity = data.data[0].quantity;
                    let process = data.data[0].usertask.process;

                    if (process === 5) {
                        _that.setData({
                            is_task_done: true
                        })
                    }

                    _that.setData({
                        accepted_credits: quantity[process] ? quantity[process] : 0
                    })
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    onUnload: function() {
        const _that = this;

        app.xpm.api('/xpmsns/pages/Article/leave')()
            .get({
                articleId: _that.data.article_id
            })
            .then((data) => {
                console.log(data);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
})