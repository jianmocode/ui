const moment = require('../../utils/moment.min.js');
const app = getApp();

Page({
    data: {
        navigate_data: {
            name: "积分记录"
        },
        coin_items: {},
        height: '',
        curr_page: 1,
    },
    filterNums: function(item) {
        item.quantity = (item.quantity + '').replace(/[&\|\\\*^%$#@\-]/g, "");
        return item;
    },
    onLoad: function() {
        const _that = this;

        _that.getHeight();
        _that.getCoins();
    },
    getHeight: function() {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight
                })
            }
        })
    },
    getCoins: function() {
        const _that = this;

        app.xpm.api('/xpmsns/user/Coin/getCoins')()
            .get({
                page: 1,
                perpage: 12,
                orderby_created_at_desc: "1"
            })
            .then((data) => {
                let coin_items = data.data;

                coin_items.map(_that.filterNums);
                _that.setData({
                    coin_items: coin_items
                })
            })
            .catch(function(error) {
                console.log(error);
            });
    },
    showMore: function() {
        const _that = this;

        wx.showLoading();

        app.xpm.api('/xpmsns/user/Coin/getCoins')()
            .get({
                perpage: 12,
                page: _that.data.curr_page + 1,
                orderby_created_at_desc: "1"
            })
            .then((data) => {
                setTimeout(() => {
                    wx.hideLoading();
                }, 300)

                let coin_items = data.data;
                coin_items.map(_that.filterNums);
                _that.setData({
                    coin_items: _that.data.coin_items.concat(coin_items),
                    curr_page: _that.data.curr_page + 1
                })
            })
            .catch(function(error) {
                console.log(error);
            });
    }
})