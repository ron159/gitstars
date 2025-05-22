import { httpRequestGitstars } from './http-request';

export async function getToken(code) {
  // 检查环境变量是否存在
  const clientId = import.meta.env.VITE_GITSTARS_CLIENT_ID;
  if (!clientId) {
    console.error('缺少VITE_GITSTARS_CLIENT_ID环境变量');
    throw new Error('缺少GitHub客户端ID配置，请检查环境变量VITE_GITSTARS_CLIENT_ID是否已设置');
  }

  return await httpRequestGitstars.post('/api/oauth/access_token', {
    code,
    client_id: clientId,
  });
}
