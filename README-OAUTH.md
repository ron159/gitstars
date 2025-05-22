# OAuth配置指南

## 问题描述

如果您遇到以下错误信息：

```
登录失败: 请求失败，状态码: 500，服务器配置错误：缺少客户端密钥。请在服务器上设置VITE_GITSTARS_CLIENT_SECRET或GITSTARS_CLIENT_SECRET环境变量。
```

这表示GitHub OAuth认证配置存在问题，需要设置GitHub客户端密钥。

## 解决方案

### 1. 获取GitHub OAuth应用的客户端密钥

1. 登录您的GitHub账户
2. 转到 [GitHub Developer Settings](https://github.com/settings/developers)
3. 点击"New OAuth App"按钮
4. 填写应用信息：
   - Application name: GitStars (或您喜欢的其他名称)
   - Homepage URL: 您的应用URL (例如 http://localhost:3000)
   - Application description: (可选) GitHub星标管理工具
   - Authorization callback URL: 与Homepage URL相同 (例如 http://localhost:3000)
5. 点击"Register application"
6. 创建成功后，点击"Generate a new client secret"生成密钥
7. 复制生成的客户端密钥

### 2. 设置环境变量

您可以通过以下两种方式设置环境变量：

#### 方法1: 使用.env文件（推荐）

在项目根目录创建`.env`文件：

```
# 前端环境变量 - GitHub OAuth应用客户端ID
VITE_GITSTARS_CLIENT_ID=您的客户端ID

# GitHub OAuth应用客户端密钥 (以下两种方式任选其一)
VITE_GITSTARS_CLIENT_SECRET=您的客户端密钥
# 或者
GITSTARS_CLIENT_SECRET=您的客户端密钥
```

#### 方法2: 使用命令行设置环境变量

```bash
# Linux/Mac
export VITE_GITSTARS_CLIENT_SECRET=您的客户端密钥
# 或者
export GITSTARS_CLIENT_SECRET=您的客户端密钥
npm run dev

# Windows
set VITE_GITSTARS_CLIENT_SECRET=您的客户端密钥
# 或者
set GITSTARS_CLIENT_SECRET=您的客户端密钥
npm run dev
```

### 3. 启动应用

```bash
npm run dev
```

## 故障排除

如果您仍然遇到问题，请检查：

1. **客户端ID是否正确设置**
   - 确保`.env`文件中的`VITE_GITSTARS_CLIENT_ID`已正确设置
   - 或在`src/components/unauth.vue`中硬编码正确的客户端ID

2. **客户端密钥是否正确**
   - 确保没有多余的空格或换行符
   - 尝试重新生成客户端密钥

3. **浏览器控制台错误**
   - 打开浏览器开发者工具，检查控制台是否有错误信息

4. **redirect_uri_mismatch错误**
   - 确保GitHub OAuth应用设置中的回调URL与应用实际URL匹配

## 测试配置

配置完成后，点击"GitHub APP 授权登录"按钮，系统应能正常跳转到GitHub授权页面并完成认证。

## 常见问题排查

### 状态码500错误

如果您看到"Request failed with status code 500"错误，请检查：

1. **环境变量是否正确设置**
   - 检查`.env`文件中的变量是否正确
   - 特别注意`VITE_GITSTARS_CLIENT_SECRET`或`GITSTARS_CLIENT_SECRET`是否已设置

2. **incorrect_client_credentials错误**
   - 检查客户端ID和密钥是否正确复制
   - 确保没有多余的空格或换行符
   - 尝试重新生成客户端密钥 