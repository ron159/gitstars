export const config = {
  runtime: 'edge',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (request, context) => {
  if (request.method === 'OPTIONS') {
    return new Response('OK', {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  const requestBody = await request.json();
  
  // 检查客户端密钥
  if (!requestBody.client_secret) {
    // 尝试从不同的环境变量名称获取
    const clientSecret = process.env.VITE_GITSTARS_CLIENT_SECRET || process.env.GITSTARS_CLIENT_SECRET;
    if (!clientSecret) {
      console.error('缺少客户端密钥环境变量');
      return new Response(JSON.stringify({
        error: 'server_configuration_error',
        error_description: '服务器配置错误：缺少客户端密钥。请在服务器上设置VITE_GITSTARS_CLIENT_SECRET或GITSTARS_CLIENT_SECRET环境变量。'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });
    }
    requestBody.client_secret = clientSecret;
  }

  // 检查客户端ID
  if (!requestBody.client_id) {
    console.error('缺少client_id参数');
    return new Response(JSON.stringify({
      error: 'missing_client_id',
      error_description: '请求中缺少client_id参数'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }

  try {
    console.log('正在请求GitHub OAuth token，参数：', {
      client_id: requestBody.client_id,
      client_secret: '***' // 安全起见不打印实际值
    });

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        ...requestBody,
        scope: 'repo' // 添加repo scope以访问私有仓库信息
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const data = await res.json();
    
    // 记录错误日志
    if (data.error) {
      console.error('GitHub OAuth错误:', data.error, data.error_description);
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  } catch (e) {
    console.error('OAuth请求异常:', e);
    return new Response(JSON.stringify({
      error: 'oauth_request_failed',
      error_description: e.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }
};
