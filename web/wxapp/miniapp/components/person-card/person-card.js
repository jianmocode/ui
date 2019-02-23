const app = getApp()

Component({
      properties: {

      },
      data: {
            credit: 0
      },
      attached: function () {
            const _that = this;

            _that.getCoin();
      },
      methods: {
            getCoin: function () {
                  const _that = this;

                  app.xpm.api('/xpmsns/user/User/getCoin')()
                        .get()
                        .then((data) => {
                              wx.hideLoading();
                        })
                        .catch(function (data) {
                              wx.hideLoading();

                              _that.setData({
                                    credit: data.extra.res.data
                              })
                        });
            }
      }
})