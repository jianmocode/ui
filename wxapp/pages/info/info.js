const app = getApp();

Page({
      data: {
            input_active: false,
            btn_edit_innertext: '完善资料',
            nickname: '',
            sex: '',
            mobile: '',
            address: '',
            is_validated: false,
            is_show_input_status: false,
            is_show_input_sex: false,
            is_show_input_address: false,
            sex_items: [{
                        name: '男',
                        value: '1'
                  },
                  {
                        name: '女',
                        value: '0'
                  }
            ],
            customItem: '全部',
            region: ['', '', ''],
            detail_address: ''
      },
      filterUserStatus: function (extra) {
            if (typeof extra === 'string') {
                  extra = JSON.parse(extra);
                  return extra;
            } else {
                  return extra;
            }
      },
      onLoad: function () {
            const _that = this;

            this.setTaskAccept('profile');

            _that.setData({
                  nickname: app.global_data.user_info.nickname,
                  sex: app.global_data.user_info.sex,
                  mobile: app.global_data.user_info.mobile,
                  address: app.global_data.user_info.address,
            });
      },
      setTaskAccept: function (slug) {
            app.xpm.api('/xpmsns/user/Task/accept')()
                  .post({
                        slug: slug
                  })
                  .then((data) => {
                        console.log(data);
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      refreshProfile: function () {
            //清空缓存
            app.xpm.require('user')
                  .refresh()
      },
      formSubmit: function (e) {
            const _that = this;

            if (_that.data.btn_edit_innertext === '完善资料') {
                  _that.setData({
                        input_active: true,
                        btn_edit_innertext: '修改完成',
                        is_validated: false
                  });
            } else {
                  if (/^1[0-9]{10}$/.test(e.detail.value.mobile)) {
                        _that.setData({
                              is_validated: true
                        })
                  } else {
                        wx.showToast({
                              title: '请输入正确的手机号码',
                              icon: 'none'
                        })
                  }
            }

            if (_that.data.is_validated) {
                  wx.showLoading();
               
                  app.global_data.user_info.nickname = e.detail.value.nickname;
                  app.global_data.user_info.sex = e.detail.value.sex === '男' ? 1 : 0;
                  app.global_data.user_info.mobile = e.detail.value.mobile;
                  app.global_data.user_info.address = e.detail.value.address;

                  app.xpm.api('/xpmsns/user/User/updateProfile')()
                        .post(app.global_data.user_info)
                        .then((data) => {
                              wx.hideLoading();

                              const user_info = data.user_info;

                              _that.setData({
                                    input_active: false,
                                    btn_edit_innertext: '完善资料'
                              });

                              for (var field in user_info) {
                                    app.xpm.require('user').set(field, user_info[field]);
                              }
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            }
      },
      handleTapStatus: function () {
            const _that = this;

            if (_that.data.input_active) {
                  _that.setData({
                        is_show_input_status: true
                  })
            }
      },
      handleTapSex: function () {
            const _that = this;

            if (_that.data.input_active) {
                  _that.setData({
                        is_show_input_sex: true
                  })
            }
      },
      radioSexChange: function (e) {
            const _that = this;

            _that.setData({
                  sex: e.detail.value,
                  is_show_input_sex: false
            });
      },
      bindRegionChange: function (e) {
            console.log('picker发送选择改变，携带值为', e.detail.value)
            this.setData({
                  region: e.detail.value
            })
      },
      handleTapAddress: function () {
            const _that = this;

            if (_that.data.input_active) {
                  _that.setData({
                        is_show_input_address: true
                  })
            }
      },
      bindTextAreaBlur: function (e) {
            const _that = this;

            _that.setData({
                  detail_address: e.detail.value
            })
      },
      handleTapAddressConfirm: function () {
            const _that = this;

            setTimeout(() => {
                  _that.setData({
                        address: `${_that.data.region[0]} ${_that.data.region[1]} ${_that.data.region[2]} | ${_that.data.detail_address}`,
                        is_show_input_address: false
                  })
            }, 300);
      }
})