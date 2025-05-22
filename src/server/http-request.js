import axios from 'axios';
import { useUserStore } from '@/store/user';

// httpRequestGitstars

export const httpRequestGitstars = axios.create();

// 添加请求拦截器用于日志记录
httpRequestGitstars.interceptors.request.use(
  (config) => {
    console.log('OAuth请求:', config.url);
    return config;
  },
  (error) => {
    console.error('OAuth请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器，完善错误处理
httpRequestGitstars.interceptors.response.use(
  (res) => {
    console.log('OAuth响应成功');
    return res.data;
  },
  (error) => {
    console.error('OAuth响应错误:', error);
    // 增强错误对象，添加更多调试信息
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
      error.message = `请求失败，状态码: ${error.response.status}，${error.response.data?.error_description || error.message}`;
    } else if (error.request) {
      console.error('无响应错误:', error.request);
      error.message = '服务器没有响应，请检查API服务是否可用';
    }
    return Promise.reject(error);
  }
);

// httpRequestGithub

export const httpRequestGithub = axios.create({
  baseURL: 'https://api.github.com',
});

httpRequestGithub.interceptors.request.use((config) => {
  const userStore = useUserStore();
  config.headers.Authorization = `Bearer ${userStore.token}`;
  return config;
});

httpRequestGithub.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // access_token 失效
    if (err.response?.status === 401) {
      localStorage.clear();
      location.reload();
    }

    return Promise.reject(err);
  },
);
