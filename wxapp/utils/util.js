const moment = require('./moment.min.js');

//计算倒计时
const fomatCloseTime = date => {
      let second_time = moment(date).diff(moment());

      let t = null;
      let d = null;
      let h = null;
      let m = null;
      let s = null;

      t = second_time / 1000;
      d = Math.floor(t / (24 * 3600));
      h = Math.floor((t - 24 * 3600 * d) / 3600);
      m = Math.floor((t - 24 * 3600 * d - h * 3600) / 60);
      s = Math.floor((t - 24 * 3600 * d - h * 3600 - m * 60));

      return [d, h, m, s];
}

module.exports = {
      fomatCloseTime: fomatCloseTime
}
