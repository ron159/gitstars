/**
 * GitHub客户端密钥更新脚本
 * 使用方法: node update-secret.js <your_github_client_secret>
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const clientSecret = process.argv[2];

if (!clientSecret) {
  console.error('错误: 缺少GitHub客户端密钥参数');
  console.log('使用方法: node update-secret.js <your_github_client_secret>');
  process.exit(1);
}

// 文件路径
const filePath = path.join(__dirname, 'api', 'oauth', 'access_token.js');

try {
  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 替换硬编码的密钥
  content = content.replace(
    /const HARDCODED_CLIENT_SECRET = ".*?";/,
    `const HARDCODED_CLIENT_SECRET = "${clientSecret}";`
  );
  
  // 写入文件
  fs.writeFileSync(filePath, content);
  
  console.log('✅ GitHub客户端密钥已成功更新！');
  console.log('您现在可以使用以下命令启动应用:');
  console.log('npm run dev');
} catch (error) {
  console.error('❌ 更新密钥时出错:', error.message);
  console.error('请确保文件存在且有写入权限。');
  process.exit(1);
} 