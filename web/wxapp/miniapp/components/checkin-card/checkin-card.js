const app = getApp()

Component({
      properties: {
            is_show: String,
            checkin_days: Number,
            checkin_credits: Array
      },
      data: {
            is_one_active: false,
            is_two_active: false,
            is_three_active: false,
            is_four_active: false,
            is_five_active: false,
            is_six_active: false,
            is_seven_active: false,
      },
      methods: {
            closeCard: function () {
                  this.setData({
                        is_show: 'false'
                  })
            },
            preventTouchMove: function () {

            },
            preventBubble: function () {

            },
            setCheckinHistory: function (callback) {
                  app.xpm.api('/xpmsns/user/Checkin/create')()
                        .post({
                              limit: 'daily'
                        })
                        .then((data) => {
                              wx.showToast({
                                    title: '签到成功',
                                    icon: 'none'
                              })
                              callback();
                        })
                        .catch(function (error) {
                              wx.showToast({
                                    title: error.message,
                                    icon: 'none'
                              })
                        });
            },
            handleTapStar: function (e) {
                  const _that = this;

                  switch (e.currentTarget.dataset.type) {
                        case '1':
                              if (_that.properties.checkin_days +1 === 1) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_one_active: true
                                          })
                                    });
                              }
                              break;
                        case '2':
                              if (_that.properties.checkin_days +1 === 2) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_two_active: true
                                          })
                                    });
                              }
                              break;
                        case '3':
                              if (_that.properties.checkin_days +1 === 3) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_three_active: true
                                          })
                                    });
                              }
                              break;
                        case '4':
                              if (_that.properties.checkin_days +1 === 4) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_four_active: true
                                          })
                                    });
                              }
                              break;
                        case '5':
                              if (_that.properties.checkin_days +1 === 5) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_five_active: true
                                          })
                                    });
                              }
                              break;
                        case '6':
                              if (_that.properties.checkin_days +1 === 6) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_six_active: true
                                          })
                                    });
                              }
                              break;
                        case '7':
                              if (_that.properties.checkin_days +1 === 7) {
                                    this.setCheckinHistory(function () {
                                          _that.setData({
                                                is_seven_active: true
                                          })
                                    });
                              }
                              break;
                  }
            }
      }
})