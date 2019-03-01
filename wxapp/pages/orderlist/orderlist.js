const app = getApp()

Page({
      data: {
            is_goods_wait: true,
            is_goods_done: false,
            order_list_uncomplete: {},
            order_list_complete: {},
            goods: {},
            height: '',
            curr_page: 1
      },
      onLoad: function () {
            const _that = this;

            _that.getHeight();

            wx.showLoading();

            _that.getAllOrders();
            _that.getCompleteOrders();

      },
      getHeight: function () {
            const _that = this;

            wx.getSystemInfo({
                  success: (res) => {
                        _that.setData({
                              height: res.windowHeight
                        })
                  }
            })
      },
      getAllOrders: function () {
            const _that = this;

            app.xpm.api('/xpmsns/pages/Order/search')()
                  .get({
                        select: 'status,goods.goods_id,goods.name,goods.cover,order.order_id,order.created_at,order.updated_at,shipping.name,order.tracking_no',
                        orderby_created_at_desc: "1",
                        perpage: 4
                  })
                  .then((data) => {
                        wx.hideLoading();
                        _that.setData({
                              order_list_uncomplete: data.data,
                              goods: data.goods
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getCompleteOrders: function () {
            const _that = this;

            app.xpm.api('/xpmsns/pages/Order/search')()
                  .get({
                        select: 'status,goods.goods_id,goods.name,goods.cover,order.order_id,order.created_at,order.updated_at,shipping.name,order.tracking_no',
                        status: 'complete',
                        orderby_created_at_desc: "1",
                        perpage: 4
                  })
                  .then((data) => {
                        wx.hideLoading();
                        _that.setData({
                              order_list_complete: data.data,
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      toggleTab: function (e) {
            if (e.target.dataset.type === 'goodswait') {
                  this.setData({
                        is_goods_wait: true,
                        is_goods_done: false
                  })
            } else {
                  this.setData({
                        is_goods_wait: false,
                        is_goods_done: true
                  })
            }
      },
      handleTapComplete: function (e) {
            const _that = this;

            wx.showLoading();
            app.xpm.api('/xpmsns/pages/Order/makeComplete')()
                  .post({
                        order_id: e.currentTarget.dataset.id
                  })
                  .then((data) => {
                        wx.hideLoading();
                        console.log(data);
                        
                        _that.getAllOrders();
                        _that.getCompleteOrders();
                  })
                  .catch(function (error) {
                        wx.hideLoading();
                        console.log(error);
                        wx.showToast({
                              title: error.message,
                              icon: 'none',
                              duration:3000
                        })
                  });
      },
      showMoreUncomplete: function () {
            const _that = this;

            wx.showLoading();

            //request 请求新的页面数据
            app.xpm.api('/xpmsns/pages/Order/search')()
                  .get({
                        select: 'status,goods.goods_id,goods.name,goods.cover,order.order_id,order.created_at,order.updated_at,shipping.name,order.tracking_no',
                        orderby_created_at_desc: "1",
                        page: _that.data.curr_page + 1,
                        perpage: 4
                  })
                  .then((data) => {
                        setTimeout(() => {
                              wx.hideLoading();
                        }, 300)

                        _that.setData({
                              order_list_uncomplete: _that.data.order_list_uncomplete.concat(data.data),
                              curr_page: _that.data.curr_page + 1
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      showMoreComplete: function () {
            const _that = this;

            wx.showLoading();

            //request 请求新的页面数据
            app.xpm.api('/xpmsns/pages/Order/search')()
                  .get({
                        select: 'status,goods.goods_id,goods.name,goods.cover,order.order_id,order.created_at,order.updated_at,shipping.name,order.tracking_no',
                        status: 'complete',
                        orderby_created_at_desc: "1",
                        page: _that.data.curr_page + 1,
                        perpage: 4
                  })
                  .then((data) => {
                        setTimeout(() => {
                              wx.hideLoading();
                        }, 300)

                        _that.setData({
                              order_list_complete: _that.data.order_list_complete.concat(data.data),
                              curr_page: _that.data.curr_page + 1
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      }
})