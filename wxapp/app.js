//app.js
var config = require('config.js');
App({
      data: {

      },
      global_data: {
            user_info: null,
            is_login_show: false
      },
      onLaunch: function () {
            // 创建 xpm 对象
            this.xpm = require('xpmjs/xpm.js').option(config);

            // 创建全局对象
            this.wss = this.xpm.require('wss'); // 信道
            this.session = this.xpm.require('session'); // 会话
            this.stor = this.xpm.require('stor'); // 存储
            this.utils = this.xpm.require('utils'); // 工具
            this.user = this.xpm.require('user'); // 工具
            this.pay = this.xpm.require('pay'); // 信道
      },
      stor: null,
      xpm: null,
      config: null, 
      userLogin: function (user_data, callback) {
            wx.showLoading();

            this.xpm.require('user')
                  .login(user_data)
                  .then((user_info) => {
                        wx.hideLoading();

                        this.global_data.user_info = this.global_data.user_info === null ? user_info : this.global_data.user_info;
                        console.log(user_info);

                        this.global_data.is_login_show = false;
                        callback();
                  })
                  .catch((error) => {
                        console.log(error);
                  })
      },
})