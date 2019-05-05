const {
      fomatCloseTime
} = require('../../utils/util.js');

const app = getApp()
Page({
      data: {
            navigate_data: {
                  name: "详情"
            },
            goods_data: {},
            close_date: {
                  left_days: 0,
                  left_hours: 0,
                  left_minutes: 0,
                  left_seconds: 0
            },
            open_date: {
                  left_days: 0,
                  left_hours: 0,
                  left_minutes: 0,
                  left_seconds: 0
            },
            has_begin: false,
            has_close: false,
            disable_exchange: true
      },
      onLoad: function (option) {
            const _that = this;
            wx.showLoading();
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
                  .catch(function (error) {
                        console.log(error);
                  });

            //设定一个timer，用来计算和显示时分秒
            setInterval(() => {
                  //先根据截止日期计算出与现在相比的时间跨度 
                  const open_time = fomatCloseTime(_that.data.goods_data.opened_at);
                  const close_time = fomatCloseTime(_that.data.goods_data.closed_at);

                  if (open_time[0] < 0 || open_time[1] < 0 || open_time[2] < 0 || open_time[3] < 0) {
                        _that.setData({
                              has_begin: true
                        })
                  } else {
                        _that.setData({
                              has_begin: false
                        })
                  }

                  if (close_time[0] < 0 || close_time[1] < 0 || close_time[2] < 0 || close_time[3] < 0) {
                        _that.setData({
                              has_close: true
                        })
                  } else {
                        _that.setData({
                              has_close: false
                        })
                  }

                  _that.setData({
                        open_date: {
                              left_days: open_time[0],
                              left_hours: open_time[1],
                              left_minutes: open_time[2],
                              left_seconds: open_time[3]
                        },
                        close_date: {
                              left_days: close_time[0],
                              left_hours: close_time[1],
                              left_minutes: close_time[2],
                              left_seconds: close_time[3]
                        }
                  })

                  if (_that.data.goods_data.available_sum > 0) {
                        _that.setData({
                              disable_exchange: _that.data.has_begin === false || _that.data.has_close === true ? true : false
                        })
                  }
            }, 1000)
      },
      handleTapGoods: function (e) {
            const _that = this;

            if (_that.data.goods_data.hasbuy) {
                  wx.showToast({
                        title: '您已经兑换过了，不能再兑换了哦',
                        icon: 'none'
                  })
            } else {
                  wx.redirectTo({
                        url: `/pages/checkstand/checkstand?goods_id=${e.currentTarget.dataset.id}`
                  })
            }
      }
})