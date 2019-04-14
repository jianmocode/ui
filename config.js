var host = "tars.jianmoapp.cn"

config = {
      mina: {
            target: false,
            priority: 0,
            server: "https://" + host,
            domain: host,
            project: "tech",
            appid: '155250244611146',
            secret: 'ef44a1c156fce6b90f08d074ed30d6f9',
            instance: "root",
      },
      wxapp: {
            "cli": "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
            "appdid": "wx0550a96041cf486c",
            "secret": "f2e5c4aee55269f427dabc07057d2113"
      }
};
module.exports = config