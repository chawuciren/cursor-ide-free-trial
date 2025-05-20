# CloudflareMailServer 安装与部署指南

本文档详细说明了CloudflareMailServer系统的安装与部署方法，包括前提条件、安装步骤、Cloudflare配置、Gmail配置以及Docker部署等内容。

> **重要提示**：在安装系统前，请确保您已完成Cloudflare账号注册、域名验证、Email Routing启用以及API密钥创建等前置工作。详细的前置配置步骤请参考[Cloudflare邮箱设置指南](cloudflare-email-setup.md)。

## 目录

- [前提条件](#前提条件)
- [安装步骤](#安装步骤)
- [Cloudflare配置](#cloudflare配置)
- [Gmail配置](#gmail配置)
- [使用Docker部署](#使用docker部署)
- [开发环境设置](#开发环境设置)
- [常见问题排查](#常见问题排查)

## 前提条件

在安装CloudflareMailServer之前，请确保您的环境满足以下条件：

### 系统要求

- **操作系统**：支持Windows、macOS或Linux
- **Node.js**：v16.0.0或更高版本
- **npm**：v7.0.0或更高版本，或者使用yarn

### 账号要求

- **Cloudflare账户**：
  - 已验证的域名
  - Email Routing功能已启用
  - 具有适当权限的API令牌

- **Gmail或其他IMAP邮箱**：
  - 用于接收转发的邮件
  - IMAP访问已启用
  - 应用专用密码（如果启用了两步验证）

### 网络要求

- 稳定的互联网连接
- 如果在中国大陆使用，可能需要配置代理以访问Gmail和Cloudflare API

## 安装步骤

### 1. 获取代码

您可以通过以下两种方式获取CloudflareMailServer的代码：

#### 方式一：克隆代码库

```bash
git clone https://github.com/yourusername/cloudflare-mail-server.git
cd cloudflare-mail-server
```

#### 方式二：下载发布版本

1. 访问[发布页面](https://github.com/yourusername/cloudflare-mail-server/releases)
2. 下载最新版本的源代码
3. 解压文件并进入解压后的目录

### 2. 安装依赖

使用npm安装依赖：

```bash
npm install
```

或者使用yarn：

```bash
yarn install
```

### 3. 配置系统

1. 复制配置模板文件：

```bash
cp config.yaml.sample config.yaml
```

2. 编辑`config.yaml`文件，根据您的需求修改配置：

```bash
# 使用您喜欢的编辑器打开配置文件
nano config.yaml  # 或者 vim config.yaml, code config.yaml 等
```

3. 配置以下关键部分：
   - 服务器端口和地址
   - Cloudflare API令牌和区域ID
   - Gmail或其他IMAP邮箱的凭据
   - 管理员账号和密码
   - JWT密钥

详细的配置说明请参考[配置文档](configuration.md)。

### 4. 初始化数据库

运行以下命令初始化SQLite数据库：

```bash
node utils/init-db.js
```

### 5. 启动服务器

启动CloudflareMailServer服务：

```bash
npm start
```

如果一切配置正确，您应该能看到类似以下的输出：

```
Server is running on http://0.0.0.0:3116
Database initialized successfully
Mail service initialized successfully
Scheduled mail fetching started
```

### 6. 访问Web界面

打开浏览器，访问：

```
http://localhost:3116
```

使用您在配置文件中设置的管理员用户名和密码登录系统。

## Cloudflare配置

要使CloudflareMailServer正常工作，您需要正确配置Cloudflare：

### 1. 创建API令牌

1. 登录[Cloudflare控制面板](https://dash.cloudflare.com/)
2. 点击右上角的个人资料图标，然后选择"我的个人资料"
3. 在左侧导航栏中选择"API令牌"
4. 点击"创建令牌"
5. 选择"创建自定义令牌"
6. 填写令牌名称（例如"CloudflareMailServer"）
7. 在权限部分，添加以下权限：
   - Zone - Email Routing: Edit
   - Zone - DNS: Edit
8. 在区域资源部分，选择"特定区域"并选择您的域名
9. 点击"继续以查看摘要"，然后点击"创建令牌"
10. 复制生成的令牌（**注意：令牌只会显示一次**）

### 2. 获取区域ID

1. 登录[Cloudflare控制面板](https://dash.cloudflare.com/)
2. 选择您要使用的域名
3. 在域名概览页面的右侧，您可以找到"区域ID"
4. 复制区域ID

### 3. 启用Email Routing

1. 登录[Cloudflare控制面板](https://dash.cloudflare.com/)
2. 选择您要使用的域名
3. 点击"电子邮件"
4. 点击"开始使用"
5. 按照提示完成Email Routing的设置

详细的Cloudflare Email Routing设置步骤请参考[Cloudflare邮箱设置指南](cloudflare-email-setup.md)。

## Gmail配置

如果您使用Gmail作为接收邮件的服务，需要进行以下配置：

### 1. 启用IMAP访问

1. 登录您的Gmail账户
2. 点击右上角的设置图标，选择"查看所有设置"
3. 进入"转发和POP/IMAP"标签
4. 在"IMAP访问"部分选择"启用IMAP"
5. 点击"保存更改"

### 2. 创建应用专用密码

如果您的Gmail账户启用了两步验证，需要创建应用专用密码：

1. 访问[Google账号安全设置](https://myaccount.google.com/security)
2. 在"登录Google"部分，选择"应用专用密码"
3. 点击"选择应用"，选择"其他（自定义名称）"
4. 输入一个名称（例如"CloudflareMailServer"）
5. 点击"生成"
6. 复制生成的应用专用密码（**注意：密码只会显示一次**）
7. 在CloudflareMailServer的配置文件中使用此密码

## 使用Docker部署

CloudflareMailServer支持使用Docker进行部署，这是一种更简单、更一致的部署方式。

### 前提条件

- 安装了Docker和Docker Compose
- 基本了解Docker的使用

### 使用Docker部署的步骤

1. 创建一个`docker-compose.yml`文件：

```yaml
version: '3'
services:
  cloudflare-mail-server:
    image: cloudflare-mail-server:latest
    build:
      context: .
    ports:
      - "3116:3116"
    volumes:
      - ./config.yaml:/app/config.yaml
      - ./data:/app/data
    restart: unless-stopped
```

2. 创建并配置`config.yaml`文件（参考[配置文档](configuration.md)）

3. 构建并启动容器：

```bash
docker-compose up -d
```

4. 查看日志：

```bash
docker-compose logs -f
```

5. 访问Web界面：

```
http://localhost:3116
```

### 使用预构建的Docker镜像

您也可以直接使用预构建的Docker镜像：

```bash
docker run -d -p 3116:3116 -v $(pwd)/config.yaml:/app/config.yaml -v $(pwd)/data:/app/data --name cloudflare-mail-server cloudflare-mail-server:latest
```

## 开发环境设置

如果您想参与CloudflareMailServer的开发，可以按照以下步骤设置开发环境：

### 1. 克隆代码库

```bash
git clone https://github.com/yourusername/cloudflare-mail-server.git
cd cloudflare-mail-server
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置开发环境

复制配置模板并进行必要的修改：

```bash
cp config.yaml.sample config.yaml
```

### 4. 初始化数据库

```bash
node utils/init-db.js
```

### 5. 启动开发服务器

```bash
npm run dev
```

这将启动带有热重载功能的开发服务器，当您修改代码时，服务器会自动重启。

## 常见问题排查

### 无法启动服务器

**问题**：运行`npm start`后，服务器无法启动。

**解决方案**：
- 检查Node.js版本是否满足要求（v16+）
- 确保所有依赖已正确安装
- 检查配置文件是否正确
- 查看日志文件中的错误信息

### 无法连接到Cloudflare API

**问题**：系统报告无法连接到Cloudflare API。

**解决方案**：
- 检查API令牌是否正确
- 确认API令牌具有正确的权限
- 如果在中国大陆使用，可能需要配置代理
- 检查网络连接是否正常

### 无法连接到IMAP服务器

**问题**：系统无法连接到IMAP服务器。

**解决方案**：
- 检查IMAP服务器地址和端口是否正确
- 确认用户名和密码是否正确
- 如果使用Gmail，确保IMAP访问已启用
- 如果启用了两步验证，确保使用的是应用专用密码
- 如果在中国大陆使用，可能需要配置代理

### 数据库初始化失败

**问题**：数据库初始化失败。

**解决方案**：
- 确保`data`目录存在且可写
- 检查SQLite是否正确安装
- 尝试手动运行初始化脚本：`node utils/init-db.js`

### 无法登录管理界面

**问题**：无法使用配置的管理员账号登录。

**解决方案**：
- 确认配置文件中的管理员用户名和密码是否正确
- 检查JWT密钥是否正确配置
- 尝试清除浏览器缓存和Cookie
- 检查日志文件中的错误信息
