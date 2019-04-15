class message {
      static showMessage() {
            const _message = document.getElementById("message");

            //出现动画
            _message.childNodes[1].style.transform = "translateY(16px)"
      }

      static hideMessage() {
            const _message = document.getElementById("message");
        
            //消失动画
            _message.childNodes[1].style.transform = "translateY(-48px)"
      }

      static clearMessage() {
            const _message = document.getElementById('message');

            if (_message != null) {
                  _message.parentNode.removeChild(_message);
            }
      }

      static common(color, shadow_color, title) {
            this.clearMessage();

            const body = document.getElementsByTagName("body")[0];
            const modal_style = `
                  width:100vw;
                  height:100vh;
                  background-color:transparent;
                  position:fixed;
                  top:0;
                  left:0;
                  z-index:999999;
                  display:flex;
                  justify-content:center;
            `

            let nodes_style = `
                  "height:48px;
                  line-height:48px;
                  padding:0 30px;
                  background-color:${color};
                  box-shadow: 4px 4px 32px ${shadow_color};
                  color:white;
                  font-size:16px;
                  letter-spacing:1px;
                  border-radius:4px;
                  transition:all ease 0.3s;
                  transform:translateY(-36px);"
            `

            let nodes = document.createElement('div');
            nodes.setAttribute("id", "message");
            nodes.setAttribute("style", modal_style);

            const nodes_main = `
                  <span style=${nodes_style}>${title}</span>
            `;
            nodes.innerHTML = nodes_main;

            body.appendChild(nodes);

            setTimeout(() => {
                  this.showMessage()
            }, 0);

            setTimeout(() => {
                  this.hideMessage()
            }, 1500);

            setTimeout(() => {
                  this.clearMessage()
            }, 1800);
      }

      static error(title) {
            this.common('#eb3939','rgba(235, 57, 57, 0.24)', title);
      }

      static warn(title) {
            this.common('#f1803f','rgba(241, 128, 63, 0.24)', title);
      }

      static success(title) {
            this.common('#19b119', 'rgba(25, 177, 25, 0.24)',title);
      }
}

module.exports = {
      message
};