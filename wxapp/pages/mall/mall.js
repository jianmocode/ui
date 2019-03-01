const app = getApp()

Page({
      data: {
            goods_items: {},
            height: '',
            curr_page: 1
      },
      onLoad: function () {
            const _that = this;

            _that.getGoods();
            _that.getHeight();
      },
      getGoods: function () {
            app.xpm.api('/xpmsns/pages/Goods/searchGoods')()
                  .get({
                        perpage: 10
                  })
                  .then((data) => {
                        this.setData({
                              goods_items: data.data
                        })
                  })
                  .catch((error) => {
                        console.log(error);
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
      handleTapGoods: function (e) {
            wx.navigateTo({
                  url: `/pages/goods/goods?goods_id=${e.currentTarget.dataset.id}`
            })
      },
      showMore: function () {
            const _that = this;

            wx.showLoading();
 
            app.xpm.api('/xpmsns/pages/Goods/searchGoods')()
                  .get({
                        perpage: 10,
                        page: _that.data.curr_page + 1
                  })
                  .then((data) => {
                        setTimeout(() => {
                              wx.hideLoading();
                        }, 300)

                        _that.setData({
                              goods_items:_that.data.goods_items.concat(data.data),
                              curr_page: _that.data.curr_page + 1
                        })
                  })
                  .catch((error) => {
                        console.log(error);
                  })
      }
})