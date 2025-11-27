"use strict";

var fs = require('fs');

var ejs = require('ejs');

var path = require('path'); // 測試機 https://stage-www.kiwipin.com/


var CDN_STAGE = 'https://stage-www-page.kiwipin.com';
var WALLET_STAGE = 'https://stage-wallet.kiwipin.com'; // 正式機 https://www.kiwipin.com/

var CDN_PROD = 'https://www-page.kiwipin.com';
var WALLET_PROD = 'https://wallet.kiwipin.com'; // 輸出資料夾

var viewsDir = path.join(__dirname, 'views');
var outDirs = {
  dist: path.join(__dirname, 'dist1_stage'),
  prod: path.join(__dirname, 'dist2_prod')
}; // 定義每個頁面的 metadata

var pageMeta = {
  'index': {
    title: 'KIWIPIN'
  },
  'product_list': {
    title: '購買點數 | KIWIPIN'
  },
  'point_detail': {
    title: '購買點數 | KIWIPIN'
  },
  'point_add': {
    title: '購買點數 | KIWIPIN'
  },
  'product': {
    title: '購買點數 | KIWIPIN'
  },
  'privacy_policy': {
    title: '隱私權政策 | KIWIPIN'
  },
  'terms_of_service': {
    title: '會員服務同意書 | KIWIPIN'
  }
}; // 確保輸出資料夾存在

Object.values(outDirs).forEach(function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}); // 讀取 views 裡所有 .ejs 檔案（忽略 layout 資料夾）

var files = fs.readdirSync(viewsDir).filter(function (file) {
  return file.endsWith('.ejs') && !file.startsWith('layout/');
});
files.forEach(function (file) {
  var templatePath = path.join(viewsDir, file);
  var template = fs.readFileSync(templatePath, 'utf-8');
  var baseName = path.basename(file, '.ejs');
  var meta = pageMeta[baseName] || {
    title: 'KIWIPIN'
  }; // 輸出到不同環境

  var targets = [{
    dir: outDirs.dist,
    cdn: CDN_STAGE,
    wallet: WALLET_STAGE
  }, {
    dir: outDirs.prod,
    cdn: CDN_PROD,
    wallet: WALLET_PROD
  }];
  targets.forEach(function (_ref) {
    var dir = _ref.dir,
        cdn = _ref.cdn,
        wallet = _ref.wallet;
    var html = ejs.render(template, {
      cdn: cdn,
      wallet: wallet,
      title: meta.title
    }, {
      filename: templatePath,
      views: [viewsDir]
    });
    var outputFile = path.join(dir, file.replace('.ejs', '.html'));
    fs.writeFileSync(outputFile, html);
    console.log("\u2705 \u5DF2\u8F38\u51FA\uFF1A".concat(outputFile));
  });
});