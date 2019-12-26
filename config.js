var host = "wss.xpmjs.com"

config = {
      mina: {
            target: false,
            priority: 0,
            server: "https://" + host,
            domain: host,
            project: "default",
            appid: '153694864269198',
            secret: '0e2930fcf9af732ce7fc417853cf3d54',
            instance: "root",
      },
      wxapp: {
            "cli": "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
            "appdid": "wx671a14fe272173d1",
            "secret": "e22fa0aae8304350fe4fa1e0c443b382"
      }
};
module.exports = config