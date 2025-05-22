# OAuth配置指南

## 问题描述

如果您遇到以下错误信息：

```
登录失败: incorrect_client_credentials. The client_id and/or client_secret passed are incorrect.
```

这表示您的GitHub OAuth应用配置不正确。请按照以下步骤设置。

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

#### 方法一：创建.env文件

在项目根目录创建`.env`文件：

```
# GitHub OAuth应用配置
VITE_GITSTARS_CLIENT_ID=您的客户端ID
GITSTARS_CLIENT_SECRET=您的客户端密钥
```

#### 方法二：使用命令行

对于前端环境变量：

```bash
# Linux/Mac
export VITE_GITSTARS_CLIENT_ID=您的客户端ID

# Windows
set VITE_GITSTARS_CLIENT_ID=您的客户端ID
```

对于后端环境变量：

```bash
# Linux/Mac
export GITSTARS_CLIENT_SECRET=您的客户端密钥

# Windows
set GITSTARS_CLIENT_SECRET=您的客户端密钥
```

### 3. 重启应用

设置环境变量后，请重启应用：

```bash
npm run dev
```

## 测试配置

配置完成后，点击"GitHub APP 授权登录"按钮，系统应能正常跳转到GitHub授权页面。

## 常见问题

1. **环境变量未生效**
   - 确保.env文件在正确位置
   - 确保您的应用能够读取这些环境变量
   - 尝试直接在启动命令中设置环境变量：`VITE_GITSTARS_CLIENT_ID=xxx npm run dev`

2. **redirect_uri_mismatch错误**
   - 确保GitHub OAuth应用设置中的回调URL与应用实际URL匹配

3. **依然显示incorrect_client_credentials错误**
   - 检查客户端ID和密钥是否正确复制
   - 确保没有多余的空格或换行符
   - 尝试重新生成客户端密钥 