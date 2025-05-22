import 'virtual:svg-icons-register';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { TOKEN_KEY, LANG_KEY } from '@/constants';
import { getToken } from '@/server/gitstars';
import { useUserStore } from '@/store/user';
import SvgIcon from '@/components/svg-icon.vue';
import VueVirtualScroller from 'vue-virtual-scroller';
import { throttle } from 'lodash';
import { createI18nByLocale } from './i18n';

function onAppError(error) {
  console.error('应用程序错误:', error);
  let errorMessage = error.message || '未知错误';
  
  // 提供更友好的错误信息
  if (errorMessage.includes('incorrect_client_credentials')) {
    errorMessage = '客户端凭据不正确。请确保已正确设置GitHub OAuth应用的客户端ID和密钥。';
  } else if (errorMessage.includes('server_configuration_error')) {
    errorMessage = '服务器配置错误。请联系管理员检查环境变量配置。';
  } else if (errorMessage.includes('missing_client_id')) {
    errorMessage = '缺少GitHub客户端ID。请检查前端环境变量VITE_GITSTARS_CLIENT_ID是否已设置。';
  }
  
  alert(`登录失败: ${errorMessage}`);
}

function onResize() {
  let fontSize = window.innerWidth / 100;
  if (fontSize < 12) {
    fontSize = 12;
  } else if (fontSize > 16) {
    fontSize = 16;
  }
  const userStore = useUserStore();
  userStore.$patch({ htmlFontSize: fontSize });
  document.scrollingElement.style.fontSize = `${fontSize}px`;
}

function removeURLCode() {
  let href = location.href.replace(/code=[^&]+/, '');
  if (href[href.length - 1] === '?') href = href.slice(0, -1);
  history.replaceState({}, null, href);
}

async function resolveToken() {
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  if (!code) return;

  removeURLCode();

  const res = await getToken(code).catch((err) => {
    onAppError(err);
  });

  if (!res.access_token) {
    onAppError({ message: `${res.error}. ${res.error_description}` });
    throw new Error(res);
  }

  localStorage.setItem(TOKEN_KEY, res.access_token);

  const userStore = useUserStore();
  userStore.$patch({ token: res.access_token });
  await userStore.resolveUserinfo();
}

async function initApp() {
  const app = createApp(App);
  app.use(createPinia());
  app.use(VueVirtualScroller);
  app.component(SvgIcon.name, SvgIcon);

  const userStore = useUserStore();
  const lang = localStorage.getItem(LANG_KEY);

  if (lang) userStore.$patch({ lang });
  app.use(createI18nByLocale(userStore.lang));

  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    userStore.$patch({ token });
    await userStore.resolveUserinfo();
  } else {
    await resolveToken();
  }

  app.mount('#app');

  window.addEventListener('resize', throttle(onResize, 300));
  onResize();
}

initApp();
