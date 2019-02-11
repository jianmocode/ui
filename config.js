var host="wss.xpmjs.com"

config = {
      mina: {
            target: false,
            priority: 0,
            server:"http://"+host,
            domain: host,
            project: "default",
            appid: '153694864269198',
            secret: '0e2930fcf9af732ce7fc417853cf3d54',
            instance: "root",
      },
      wxapp: {
            "cli": "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
            "appdid": "wx0550a96041cf486c",
            "secret": "f2e5c4aee55269f427dabc07057d2113"
      }
};
module.exports = config