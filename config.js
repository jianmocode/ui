var host = "demo.jianmoapp.cn"

config = {
      mina: {
            target: false,
            priority: 0,
            server: "https://" + host,
            domain: host,
            project: "tech",
            appid: '155190147649899',
            secret: '53a9bfa587c50de2ddaae35f490b2af6',
            instance: "root",
      },
      wxapp: {
            "cli": "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
            "appdid": "wx671a14fe272173d1",
            "secret": "e22fa0aae8304350fe4fa1e0c443b382"
      }
};
module.exports = config