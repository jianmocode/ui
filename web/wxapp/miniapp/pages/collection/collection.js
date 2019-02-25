const moment = require('../../utils/moment.min.js');
const app = getApp();

Page({
      data: {
            collection_items: {},
            height: '',
            curr_page: 1,
      },
      filterTiming: function (timing) {
            let now = moment(timing.substring(0, 10));
            let diff = now.diff(moment(), 'days') + '';
            // let diff_days = diff.replace(/\b(0+)/gi, "");
            let diff_days = diff.replace(/\b(0+)/gi, "").replace(/[&\|\\\*^%$#@\-]/g, "");
            return diff_days === '' ? '今天' : diff_days + '天前';
      },
      onLoad: function () { 
            const _that = this;

            //获取页面高度
            wx.getSystemInfo({
                  success: (res) => {
                        _that.setData({
                              height: res.windowHeight
                        })
                  }
            })

            this.getCollection();
      },
      getCollection: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user/Favorite/search')()
                  .get({
                        perpage: 12,
                        orderby_created_at_desc: "1"
                  })
                  .then((data) => {
                        let collection_items = data.data;
                        collection_items.map((item) => {
                              item.created_at = _that.filterTiming(item.created_at);
                              return item;
                        })
                        _that.setData({
                              collection_items: collection_items
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      handleTapCancel: function (e) {
            app.xpm.api('/xpmsns/user/Favorite/remove')()
                  .post({
                        favorite_id: e.currentTarget.dataset.id
                  })
                  .then((data) => {
                        wx.showToast({
                              title: data.message,
                              icon: 'none'
                        })
                        this.getCollection();
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      handleTapArtical: function (e) {
            wx.navigateTo({
                  url: `/pages/artical/artical?article_id=${e.currentTarget.dataset.id}`
            })
      },
      showMore: function () {
            const _that = this;

            wx.showLoading();

            app.xpm.api('/xpmsns/user/Favorite/search')()
                  .get({
                        perpage: 12,
                        page: _that.data.curr_page + 1,
                        orderby_created_at_desc: "1"
                  })
                  .then((data) => {
                        setTimeout(() => {
                              wx.hideLoading();
                        }, 300)

                        let collection_items = data.data;
                        collection_items.map((item) => {
                              item.created_at = _that.filterTiming(item.created_at);
                              return item;
                        })
                        _that.setData({
                              collection_items: _that.data.collection_items.concat(collection_items),
                              curr_page: _that.data.curr_page + 1
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      }
})