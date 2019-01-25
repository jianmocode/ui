var host = "re.xpmsns.com";

config = {
	mina:{
		target: false,
		priority:0,
		server:"https://"+host,
		domain:host,
		project:"jm-tech",
		appid:'154487369966420',
		secret:'538fabbc5aea9b723b8a90107fdc0284',
		instance:"root",
	},
	wxapp:{
		"cli":"/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli",
		"appdid": "wx0550a96041cf486c",
		"secret": "f2e5c4aee55269f427dabc07057d2113"
	}
};
module.exports = config