const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3030;

// 创建一个简单的配置文件，如果不存在的话
const configPath = path.join(process.cwd(), '.oauth-config.json');
let config = { client_secret: '' };

try {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('已加载OAuth配置文件');
  } else {
    console.log('未找到OAuth配置文件，将创建一个新文件');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`已创建配置文件: ${configPath}`);
    console.log('请编辑此文件并填入您的GitHub客户端密钥');
  }
} catch (err) {
  console.error('读取或创建配置文件时出错:', err);
}

// 启用CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.get('/config', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'config-page.html'));
});

// 处理GitHub OAuth请求
app.post('/api/oauth/access_token', async (req, res) => {
  try {
    console.log('收到OAuth请求:', req.body);
    
    // 检查必要参数
    const { code, client_id } = req.body;
    if (!code || !client_id) {
      return res.status(400).json({
        error: 'missing_parameters',
        error_description: '缺少必要参数：code或client_id'
      });
    }
    
    // 获取客户端密钥，优先使用环境变量，其次使用配置文件
    let client_secret = process.env.GITSTARS_CLIENT_SECRET || config.client_secret;
    
    if (!client_secret) {
      console.error('错误: 缺少GitHub客户端密钥配置');
      return res.status(500).json({
        error: 'server_configuration_error',
        error_description: '服务器配置错误：缺少客户端密钥。请在.env文件或.oauth-config.json文件中设置客户端密钥。'
      });
    }
    
    // 发送请求到GitHub OAuth API
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      code,
      client_id,
      client_secret,
      scope: 'repo'
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GitHub OAuth响应:', response.data);
    
    // 返回响应
    return res.json(response.data);
  } catch (error) {
    console.error('OAuth处理错误:', error);
    
    // 返回格式化的错误
    const statusCode = error.response?.status || 500;
    const errorData = {
      error: 'oauth_request_failed',
      error_description: error.response?.data?.error_description || error.message
    };
    
    return res.status(statusCode).json(errorData);
  }
});

// 配置管理端点
app.post('/api/config', express.json(), (req, res) => {
  try {
    const { client_secret } = req.body;
    
    if (!client_secret) {
      return res.status(400).json({
        error: 'missing_client_secret',
        error_description: '请提供client_secret参数'
      });
    }
    
    // 更新配置
    config.client_secret = client_secret;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('已更新客户端密钥配置');
    return res.json({ success: true, message: '配置已更新' });
  } catch (error) {
    console.error('更新配置时出错:', error);
    return res.status(500).json({
      error: 'config_update_failed',
      error_description: error.message
    });
  }
});

// 获取当前配置状态
app.get('/api/config/status', (req, res) => {
  const hasEnvSecret = !!process.env.GITSTARS_CLIENT_SECRET;
  const hasFileSecret = !!config.client_secret;
  
  return res.json({
    env_configured: hasEnvSecret,
    file_configured: hasFileSecret,
    has_valid_config: hasEnvSecret || hasFileSecret
  });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API服务器运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`本地API服务器运行在 http://localhost:${PORT}`);
  console.log(`环境变量状态: GITSTARS_CLIENT_SECRET ${process.env.GITSTARS_CLIENT_SECRET ? '已设置' : '未设置'}`);
  console.log(`配置文件状态: client_secret ${config.client_secret ? '已设置' : '未设置'}`);
  
  if (!process.env.GITSTARS_CLIENT_SECRET && !config.client_secret) {
    console.log('\x1b[33m%s\x1b[0m', '警告: 未配置GitHub客户端密钥，OAuth登录将无法正常工作');
    console.log('\x1b[33m%s\x1b[0m', '请使用以下方法之一设置客户端密钥:');
    console.log('\x1b[33m%s\x1b[0m', '1. 在.env文件中设置GITSTARS_CLIENT_SECRET环境变量');
    console.log('\x1b[33m%s\x1b[0m', `2. 编辑${configPath}文件并设置client_secret`);
    console.log('\x1b[33m%s\x1b[0m', '3. 使用以下命令设置客户端密钥:');
    console.log('\x1b[33m%s\x1b[0m', `   curl -X POST -H "Content-Type: application/json" -d '{"client_secret":"您的密钥"}' http://localhost:${PORT}/api/config`);
  }
}); 