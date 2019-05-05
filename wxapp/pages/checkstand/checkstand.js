const app = getApp()

Page({
    data: {
        navigate_data: {
            name: "兑换详情"
        },
        goods_data: {},
        user_info: {},
        nickname: '',
        mobile: '',
        address: '',
    },
    onLoad: function(option) {
        const _that = this;

        _that.setData({
            nickname: app.global_data.user_info.nickname,
            mobile: app.global_data.user_info.mobile,
            address: app.global_data.user_info.address,
        });

        app.xpm.api('/xpmsns/pages/Goods/getGoodsDetail')()
            .get({
                goods_id: option.goods_id
            })
            .then((data) => {
                wx.hideLoading();
                _that.setData({
                    goods_data: data
                })
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    handleTapAddress: function() {
        wx.navigateTo({
            url: '/pages/info/info'
        })
    },
    handleTapDeal: function() {
        const _that = this;

        app.xpm.api('/xpmsns/pages/Order/makeAndPay')()
            .post({
                goods: _that.data.goods_data.goods_id,
                payment: 'coin'
            })
            .then((data) => {
                wx.hideLoading();
                if (data.order_id) {
                    wx.showModal({
                        title: '提示',
                        content: '兑换成功',
                        showCancel: false,
                        confirmColor: '#f15e86',
                        success(res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '/pages/orderlist/orderlist'
                                })
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }

            })
            .catch(function(error) {
                wx.showToast({
                    title: error.message,
                    icon: 'none',
                    duration: 2000
                })
            });
    }
})