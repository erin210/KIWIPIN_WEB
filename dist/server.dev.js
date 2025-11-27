"use strict";

var express = require('express');

var path = require('path');

var fs = require('fs');

var cookieParser = require('cookie-parser'); //middleware(目前沒用到)


var app = express(); //(目前沒用到)
// const CDN_URL = 'https://stage-www-page.kiwipin.com';
// const CDN_WALLET = 'https://stage-wallet.kiwipin.com';

var CDN_URL = '';
var CDN_WALLET = '';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/scss/zh_TW', express["static"](path.join(__dirname, 'scss/zh_TW')));
app.use('/scss/en_US', express["static"](path.join(__dirname, 'scss/en_US')));
app.use('/assets', express["static"](path.join(__dirname, 'assets')));
app.use(cookieParser()); // app.use(express.static(path.join(__dirname, 'dist')));
// 定義每個頁面的 metadata
// const pageMeta = {
//   'index': { title: 'KIWIPIN' },
//   'product_list': { title: '購買點數 | KIWIPIN' },
//   'point_detail': { title: '購買點數 | KIWIPIN' },
//   'point_add': { title: '購買點數 | KIWIPIN' },
//   'product': { title: '購買點數 | KIWIPIN' },
//   'privacy_policy': { title: '隱私權政策 | KIWIPIN' },
//   'terms_of_service': { title: '會員服務同意書 | KIWIPIN' },
// };

function normalizeLang(rawLang) {
  if (!rawLang) return 'en_US';
  return rawLang.replace('-', '_');
} // 遞迴掃描 views 資料夾內所有 .ejs 檔案（排除 layout 資料夾）


function walkViews(dir) {
  var fileList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  fs.readdirSync(dir).forEach(function (file) {
    var fullPath = path.join(dir, file);
    var relative = path.relative(path.join(__dirname, 'views'), fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      if (relative.startsWith('layout')) return;
      walkViews(fullPath, fileList);
    } else if (file.endsWith('.ejs')) {
      fileList.push(relative);
    }
  });
  return fileList;
} // 抓ejs檔案


var viewFiles = walkViews(path.join(__dirname, 'views')); // 路由

viewFiles.forEach(function (relativePath) {
  var templateName = relativePath.replace(/\\/g, '/').replace(/\.ejs$/, '');
  var route = templateName === 'index' ? '/' : '/' + templateName;
  var key = path.basename(templateName); // 抓檔案名稱
  // const meta = pageMeta[key] || { title: 'KIWIPIN' };

  app.get(route, function (req, res) {
    var rawLang = req.cookies.userLang || req.headers['accept-language'] || 'en-US'; //(目前沒用到)

    var lang = normalizeLang(rawLang); //(目前沒用到)

    res.render(templateName, {
      // title: meta.title,
      cdn: CDN_URL,
      wallet: CDN_WALLET,
      lang: lang //(目前沒用到)

    });
  });
  console.log("\u2705 \u8A3B\u518A\u8DEF\u7531: ".concat(route, " \u2192 views/").concat(templateName, ".ejs"));
});
app.listen(3000, function () {
  console.log('🚀 Server running at http://localhost:3000');
});