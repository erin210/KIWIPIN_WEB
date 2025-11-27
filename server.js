const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser'); //middleware(目前沒用到)
const app = express(); //(目前沒用到)

// const CDN_URL = 'https://stage-www-page.kiwipin.com';
// const CDN_WALLET = 'https://stage-wallet.kiwipin.com';
const CDN_URL = '';
const CDN_WALLET = '';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/scss/zh_TW', express.static(path.join(__dirname, 'scss/zh_TW')));
app.use('/scss/en_US', express.static(path.join(__dirname, 'scss/en_US')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'dist')));

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
}

// 遞迴掃描 views 資料夾內所有 .ejs 檔案（排除 layout 資料夾）
function walkViews(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relative = path.relative(path.join(__dirname, 'views'), fullPath);
    if (fs.statSync(fullPath).isDirectory()) {
      if (relative.startsWith('layout')) return;
      walkViews(fullPath, fileList);
    } else if (file.endsWith('.ejs')) {
      fileList.push(relative);
    }
  });
  return fileList;
}

// 抓ejs檔案
const viewFiles = walkViews(path.join(__dirname, 'views'));

// 路由
viewFiles.forEach(relativePath => {
  const templateName = relativePath.replace(/\\/g, '/').replace(/\.ejs$/, '');
  const route = templateName === 'index' ? '/' : '/' + templateName;

  const key = path.basename(templateName); // 抓檔案名稱
  // const meta = pageMeta[key] || { title: 'KIWIPIN' };

  app.get(route, (req, res) => {
    const rawLang = req.cookies.userLang || req.headers['accept-language'] || 'en-US'; //(目前沒用到)
    const lang = normalizeLang(rawLang); //(目前沒用到)
    res.render(templateName, {
      // title: meta.title,
      cdn: CDN_URL,
      wallet: CDN_WALLET,
      lang: lang //(目前沒用到)
    });
  });

  console.log(`✅ 註冊路由: ${route} → views/${templateName}.ejs`);
});

app.listen(3033, () => {
  console.log('🚀 Server running at http://localhost:3033');
});