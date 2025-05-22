const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3030;

// 启用CORS
app.use(cors());
app.use(express.json());

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
    
    // 获取客户端密钥
    const client_secret = process.env.GITSTARS_CLIENT_SECRET;
    if (!client_secret) {
      console.error('错误: 缺少GITSTARS_CLIENT_SECRET环境变量');
      return res.status(500).json({
        error: 'server_configuration_error',
        error_description: '服务器配置错误：缺少客户端密钥'
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

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API服务器运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`本地API服务器运行在 http://localhost:${PORT}`);
  console.log(`环境变量状态: GITSTARS_CLIENT_SECRET ${process.env.GITSTARS_CLIENT_SECRET ? '已设置' : '未设置'}`);
}); 