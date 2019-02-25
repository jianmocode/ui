const app = getApp()

Page({
      data: {

      },
      onLoad: function (option) {
            const _that = this;

            _that.getInvitation(option);

            if (option.invite_type === 'invite_article') {
                  _that.navToArticle(option);
            } else {
                  _that.navToIndex();
            }
      },
      getInvitation: function (option) {
            app.xpm.api('/xpmsns/user/Invite/get')()
                  .get({
                        slug: option.invite_type,
                        user_id: option.user_id
                  })
                  .then((data) => {
                        console.log(data);
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      navToArticle: function (option) {
            wx.redirectTo({
                  url: `/pages/artical/artical?article_id=${option.article_id}&from=share`
            })
      },
      navToIndex: function () {
            wx.redirectTo({
                  url: '/pages/guide/guide'
            })
      }
})