var host="alpha.jianmoapp.com"

config = {
      mina: {
            target: false,
            priority: 0,
            server:"https://"+host,
            domain: host,
            project: "default",
            appid: '154986709417809',
            secret: 'ad899eb233e03779176feb2c62ce6b70',
            instance: "root",
      }, 
      wxapp: {
            "cli": "/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
            "appdid": "wx0550a96041cf486c",
            "secret": "f2e5c4aee55269f427dabc07057d2113"
      }
};
module.exports = config