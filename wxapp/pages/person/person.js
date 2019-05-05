const app = getApp()

Page({
    data: {
        navigate_data: {
            name: "我的"
        },
    },
    onLoad: function() {
        const _that = this;

    },
    handleTapPersonItem: function(e) {
        switch (e.currentTarget.dataset.type) {
            case 'news':
                wx.navigateTo({
                    url: '/pages/message/message'
                })
                break;
            case 'collection':
                wx.navigateTo({
                    url: '/pages/collection/collection'
                })
                break;
            case 'info':
                wx.navigateTo({
                    url: '/pages/info/info'
                })
                break;
            case 'order':
                wx.navigateTo({
                    url: '/pages/orderlist/orderlist'
                })
                break;
            case 'terms':
                wx.navigateTo({
                    url: '/pages/terms/terms'
                })
                break;
        }
    }
})