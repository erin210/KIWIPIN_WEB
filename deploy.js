require('dotenv').config();//讀取.env

const AWS = require('aws-sdk');
const fg = require('fast-glob');
const md5File = require('md5-file');
const fs = require('fs');
const path = require('path');

// ===== 1. 環境設定 =====
const env = process.env.NODE_ENV || 'stage'; //不是stage的話就是prod

const S3_BUCKET = env === 'stage'
    ? process.env.S3_BUCKET_STAGE
    : process.env.S3_BUCKET_PROD;

const DIST_DIR = env === 'stage'
    ? process.env.DIST_STAGE
    : process.env.DIST_PROD;

const ASSETS_DIR = process.env.ASSETS_DIR;

// ===== 2. AWS 設定 =====
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const cloudfront = new AWS.CloudFront();

// ===== 3. 取得 S3 已有檔案 ETag =====
async function getS3FileETags(prefix) {
    const objects = {};
    let ContinuationToken = null;
    do {
        const res = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: prefix,
            ContinuationToken
        }).promise();

        res.Contents.forEach(obj => {
            objects[obj.Key] = obj.ETag.replace(/"/g, '');
        });

        ContinuationToken = res.IsTruncated ? res.NextContinuationToken : null;
    } while (ContinuationToken);

    return objects;
}

// ===== 4. 上傳檔案 =====
async function uploadFile(localPath, s3Key) {
    const content = fs.readFileSync(localPath);

    const params = {
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: content,
        ContentType: s3Key.endsWith('.css') ? 'text/css' : undefined,
        CacheControl: s3Key.endsWith('.css') ? 'no-cache' : undefined
    };

    await s3.putObject(params).promise();
    console.log(`✅ Uploaded: ${s3Key}`);
}

// ===== 5. CloudFront 清除快取 =====

// ===== 6. 增量上傳資料夾 =====
async function deployFolder(localFolder, s3Prefix = '') {
    const s3Files = await getS3FileETags(s3Prefix);
    const files = await fg([`${localFolder}/**/*`], { onlyFiles: true });

    for (const file of files) {
        const relativePath = path.relative(localFolder, file).replace(/\\/g, '/');
        const s3Key = s3Prefix ? `${s3Prefix}/${relativePath}` : relativePath;

        const md5 = md5File.sync(file);
        if (s3Files[s3Key] !== md5) {
            await uploadFile(file, s3Key);
        } else {
            console.log(`⚡ Skipped (unchanged): ${s3Key}`);
        }
    }
}

// ===== 7. 主流程 =====
(async () => {
    try {
        console.log(`🚀 Deploying environment: ${env}`);

        // 上傳 HTML
        await deployFolder(path.resolve(DIST_DIR));

        // 上傳 assets
        await deployFolder(path.resolve(ASSETS_DIR), 'assets');

        console.log('🎉 Deployment complete!');
    } catch (err) {
        console.error('❌ Deployment failed:', err);
    }
})();

