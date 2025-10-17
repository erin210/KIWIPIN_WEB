const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// 測試機 https://stage-www.kiwipin.com/
const CDN_STAGE = 'https://stage-www-page.kiwipin.com';
const WALLET_STAGE = 'https://stage-wallet.kiwipin.com';

// 正式機 https://www.kiwipin.com/
const CDN_PROD = 'https://www-page.kiwipin.com';
const WALLET_PROD = 'https://wallet.kiwipin.com';

// 輸出資料夾
const viewsDir = path.join(__dirname, 'views');
const outDirs = {
  dist: path.join(__dirname, 'dist1_stage'),
  prod: path.join(__dirname, 'dist2_prod'),
};

// 定義每個頁面的 metadata
const pageMeta = {
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
  },
};

// 確保輸出資料夾存在
Object.values(outDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// 讀取 views 裡所有 .ejs 檔案（忽略 layout 資料夾）
const files = fs.readdirSync(viewsDir)
  .filter(file => file.endsWith('.ejs') && !file.startsWith('layout/'));

files.forEach(file => {
  const templatePath = path.join(viewsDir, file);
  const template = fs.readFileSync(templatePath, 'utf-8');
  const baseName = path.basename(file, '.ejs');
  const meta = pageMeta[baseName] || {
    title: 'KIWIPIN'
  };

  // 輸出到不同環境
  const targets = [{
      dir: outDirs.dist,
      cdn: CDN_STAGE,
      wallet: WALLET_STAGE
    },
    {
      dir: outDirs.prod,
      cdn: CDN_PROD,
      wallet: WALLET_PROD
    }
  ];

  targets.forEach(({
    dir,
    cdn,
    wallet
  }) => {
    const html = ejs.render(template, {
      cdn,
      wallet,
      title: meta.title
    }, {
      filename: templatePath,
      views: [viewsDir]
    });

    const outputFile = path.join(dir, file.replace('.ejs', '.html'));
    fs.writeFileSync(outputFile, html);
    console.log(`✅ 已輸出：${outputFile}`);
  });
});