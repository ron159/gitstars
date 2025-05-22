# OAuth配置指南

## 问题描述

如果您遇到以下错误信息：

```
登录失败: incorrect_client_credentials. The client_id and/or client_secret passed are incorrect.
```

或

```
登录失败: Request failed with status code 500
```

这表示GitHub OAuth认证配置存在问题。请按照以下步骤设置。

## 解决方案

### 1. 创建GitHub OAuth应用

1. 登录您的GitHub账户
2. 转到 [GitHub Developer Settings](https://github.com/settings/developers)
3. 点击"New OAuth App"按钮
4. 填写应用信息：
   - Application name: GitStars (或您喜欢的其他名称)
   - Homepage URL: 您的应用URL (例如 http://localhost:30000)
   - Application description: (可选) GitHub星标管理工具
   - Authorization callback URL: 与Homepage URL相同 (例如 http://localhost:30000)
5. 点击"Register application"
6. 创建成功后，您将看到Client ID
7. 点击"Generate a new client secret"生成密钥

### 2. 设置环境变量

在项目根目录创建`.env`文件：

```
# 前端环境变量 - GitHub OAuth应用客户端ID
VITE_GITSTARS_CLIENT_ID=您的客户端ID

# 本地API服务器配置
VITE_API_PROXY=http://localhost:3030

# 后端环境变量 - GitHub OAuth应用客户端密钥
GITSTARS_CLIENT_SECRET=您的客户端密钥

# API服务器端口 (可选，默认3030)
API_PORT=3030
```

### 3. 安装依赖

本地API服务器需要一些额外的依赖：

```bash
npm install express cors axios dotenv http-proxy-middleware
```

### 4. 启动本地API服务器

在一个单独的终端窗口中运行：

```bash
node local-api-server.js
```

如果一切正常，您应该看到以下输出：

```
本地API服务器运行在 http://localhost:3030
环境变量状态: GITSTARS_CLIENT_SECRET 已设置
```

### 5. 启动前端应用

在另一个终端窗口中运行：

```bash
npm run dev
```

## 测试配置

配置完成后，点击"GitHub APP 授权登录"按钮，系统应能正常跳转到GitHub授权页面并完成认证。

## 常见问题排查

### 状态码500错误

如果您看到"Request failed with status code 500"错误，请检查：

1. **本地API服务器是否运行**
   - 确保您已经启动了`local-api-server.js`
   - 检查控制台是否有错误信息

2. **环境变量是否正确设置**
   - 检查`.env`文件中的变量是否正确
   - 特别注意`GITSTARS_CLIENT_SECRET`是否已设置

3. **代理配置是否正确**
   - 确保`VITE_API_PROXY`设置为本地API服务器地址（默认为`http://localhost:3030`）

### 浏览器开发者工具

如遇问题，请打开浏览器开发者工具的网络和控制台面板，查看请求和响应详情：

1. 查找`/api/oauth/access_token`请求
2. 检查请求是否包含正确的`client_id`和`code`
3. 检查响应状态和错误消息

### 其他常见问题

1. **环境变量未生效**
   - 确保`.env`文件在正确位置
   - 重启应用和API服务器

2. **redirect_uri_mismatch错误**
   - 确保GitHub OAuth应用设置中的回调URL与应用实际URL匹配

3. **依然显示incorrect_client_credentials错误**
   - 检查客户端ID和密钥是否正确复制
   - 确保没有多余的空格或换行符
   - 尝试重新生成客户端密钥 