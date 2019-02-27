const moment = require('../../utils/moment.min.js');
const app = getApp()

Page({
      data: {
            is_show_checkin: 'false',
            is_show_invite: 'false',
            is_show_read: 'false',
            is_show_collect: 'false',
            is_show_dailytask: true,
            is_show_invitetask: false,
            checkin_process: 0,
            reading_process: 0,
            invite_reading_process: 0,
            collect_process: 0,
            info_process: 0,
            invite_friend_process: 0,
            checkin_credits: [],
            artical_items: {},
            show_credits_checkin: 0,
            show_credits_read: 0,
            show_credits_invite_read: 0,
            show_credits_collect: 0,
            show_credits_person_info: 0,
            show_credits_invite_person: []
      },
      onLoad: function () {
            const _that = this;

            this.getCheckinHistory();
            this.getReadingHistory();
            this.getInviteReadingHistory();
            this.getCollectHistory();
            this.getInfoHistory();
            this.getInviteFriendHistory();

            this.getRecommend();
      },
      getRecommend: function () { 
            const _that = this;

            app.xpm.api('/xpmsns/pages/Recommend/getContents')()
                  .get({
                        perpage: 5,
                        slugs: 'weekly_hotnews'
                  })
                  .then((data) => {
                        _that.setData({
                              artical_items: data.data
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getCheckinHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'checkin'
                  })
                  .then((data) => {
                        _that.setData({
                              show_credits_checkin: data.data[0].quantity[0],
                              checkin_credits: data.data[0].quantity,
                              checkin_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getReadingHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'article-reading'
                  })
                  .then((data) => {
                        _that.setData({
                              reading_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                              show_credits_read: data.data[0].quantity[0]
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getInviteReadingHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'article-invitee-reading'
                  })
                  .then((data) => {
                        _that.setData({
                              invite_reading_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                              show_credits_invite_read: data.data[0].quantity[0]
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getCollectHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'favorite'
                  })
                  .then((data) => {
                        _that.setData({
                              collect_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                              show_credits_collect: data.data[0].quantity[0]
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      getInfoHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'profile'
                  })
                  .then((data) => {
                        _that.setData({
                              info_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                              show_credits_person_info: data.data[0].quantity[0]
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      }, 
      getInviteFriendHistory: function () {
            const _that = this;

            app.xpm.api('/xpmsns/user//Task/gettasks')()
                  .get({
                        slug: 'invite'
                  })
                  .then((data) => {
                        _that.setData({
                              invite_friend_process: data.data[0].usertask !== null ? data.data[0].usertask.process : 0,
                              show_credits_invite_person: data.data[0].quantity
                        })
                  })
                  .catch(function (error) {
                        console.log(error);
                  });
      },
      handleTapComplete: function (e) {
            const _that = this;

            switch (e.target.dataset.type) {
                  case 'checkin':
                        _that.setData({
                              is_show_checkin: 'true'
                        });
                        this.setTaskAccept('checkin');
                        break;
                  case 'read':
                        _that.setData({
                              is_show_read: 'true'

                        });
                        this.setTaskAccept('article-reading');
                        break;
                  case 'invite':
                        _that.setData({
                              is_show_invite: 'true'
                        });
                        this.setTaskAccept('article-invitee-reading');
                        break;
                  case 'collect':
                        _that.setData({
                              is_show_collect: 'true'
                        });
                        this.setTaskAccept('favorite');
                        break;
            }
      },
      onShareAppMessage: function (e) {
            const _that = this;
            let invite_type = '';

            wx.showShareMenu({
                  withShareTicket: true
            })

            if (e.target.dataset.type === 'invite_article') {
                  invite_type = 'invite_article';
                  app.xpm.api('/xpmsns/user/Invite/create')()
                        .post({
                              slug: 'invite_article'
                        })
                        .then((data) => {
                              console.log(data);
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            } else {
                  this.setTaskAccept('invite');

                  invite_type = 'invite_signup';
                  app.xpm.api('/xpmsns/user/Invite/create')()
                        .post({
                              slug: 'invite_signup'
                        })
                        .then((data) => {
                              console.log(data);
                        })
                        .catch(function (error) {
                              console.log(error);
                        });
            }

            return {
                  title: e.target.dataset.title ? e.target.dataset.title : '看好文，获积分，换豪礼',
                  path: `/pages/invitereading/invitereading?article_id=${e.target.dataset.id}&user_id=${app.global_data.user_info.user_id}&invite_type=${invite_type}`,
                  imageUrl: e.target.dataset.coverurl ? e.target.dataset.coverurl : '../../images/pictrue_goods_eg.jpg'
            }
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
      handleTapArticle: function (e) {
            wx.navigateTo({
                  url: `/pages/artical/artical?article_id=${e.target.dataset.articleid}`
            })
      },
      toggleTab: function (e) {
            if (e.target.dataset.type === 'dailytask') {
                  this.setData({
                        is_show_dailytask: true,
                        is_show_invitetask: false
                  })
            } else {
                  this.setData({
                        is_show_dailytask: false,
                        is_show_invitetask: true
                  })
            }
      }
})