#!/bin/bash
echo "复制 uikit.min.css"
cp dist/css/uikit.min.css ../../web/desktop/assets/css
cp dist/css/uikit.min.css ../../web/mobile/assets/css

echo "复制 uikit.min.js"
cp dist/js/uikit.min.js ../../web/desktop/assets/js
cp dist/js/uikit.min.js ../../web/mobile/assets/js

echo "复制 uikit-icons.min.js"
cp dist/js/uikit-icons.min.js ../../web/desktop/assets/js
cp dist/js/uikit-icons.min.js ../../web/mobile/assets/js

echo "安装成功"