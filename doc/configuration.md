# CloudflareMailServer 配置说明

本文档详细说明了CloudflareMailServer系统的配置方法，包括服务器设置、代理设置、Cloudflare配置、邮件服务配置等。

> **重要提示**：在配置系统前，请确保您已完成Cloudflare账号注册、域名验证、Email Routing启用以及API密钥创建等前置工作。详细的前置配置步骤请参考[Cloudflare邮箱设置指南](cloudflare-email-setup.md)。

## 目录

- [配置文件概述](#配置文件概述)
- [配置项详解](#配置项详解)
  - [服务器配置](#服务器配置)
  - [代理配置](#代理配置)
  - [Cloudflare配置](#cloudflare配置)
  - [邮件服务配置](#邮件服务配置)
  - [日志配置](#日志配置)
  - [管理员账号配置](#管理员账号配置)
  - [JWT认证配置](#jwt认证配置)
  - [登录限制配置](#登录限制配置)
- [配置示例](#配置示例)
- [配置注意事项](#配置注意事项)

## 配置文件概述

CloudflareMailServer使用YAML格式的配置文件`config.yaml`进行配置。系统提供了一个配置模板文件`config.yaml.sample`，您可以基于此模板创建自己的配置文件。

配置文件包含以下主要部分：
- 服务器配置
- 代理配置（可选）
- Cloudflare配置
- 邮件服务配置
- 日志配置
- 管理员账号配置
- JWT认证配置
- 登录限制配置

## 配置项详解

### 服务器配置

服务器配置部分定义了系统的监听地址和端口。

```yaml
server:
  port: 3116 # 端口
  host: '0.0.0.0' # 地址
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| port | 服务器监听端口 | 3116 | 是 |
| host | 服务器监听地址，`0.0.0.0`表示监听所有网络接口 | 0.0.0.0 | 是 |

### 代理配置

如果您的服务器需要通过代理访问外部网络，可以配置代理设置。

```yaml
proxy:
  enabled: false # 代理设置
  host: 127.0.0.1 # 代理地址
  port: 10808 # 代理端口
  protocol: socks5 # 代理协议
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| enabled | 是否启用代理 | false | 是 |
| host | 代理服务器地址 | 127.0.0.1 | 当enabled为true时必填 |
| port | 代理服务器端口 | 10808 | 当enabled为true时必填 |
| protocol | 代理协议类型，支持socks5、http等 | socks5 | 当enabled为true时必填 |

### Cloudflare配置

Cloudflare配置部分定义了与Cloudflare API交互所需的信息，支持配置多个域名。

```yaml
cloudflare:
  - emailForward: Gmail用户名@gmail.com # 邮箱用户名
    domain: '@你的域名.com' # 域名
    apiToken: API令牌 # API令牌
    zoneId: zoneId # Zone ID
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| emailForward | 邮件转发目标地址，通常是您的Gmail地址 | 无 | 是 |
| domain | 域名，格式为@example.com | 无 | 是 |
| apiToken | Cloudflare API令牌，需要有Email Routing和DNS的编辑权限 | 无 | 是 |
| zoneId | Cloudflare区域ID，可在Cloudflare域名概览页面找到 | 无 | 是 |

您可以添加多个域名配置，只需在cloudflare数组中添加多个项目即可。

### 邮件服务配置

邮件服务配置部分定义了与IMAP/SMTP服务器交互所需的信息。

```yaml
email:
  user: Gmail用户名@gmail.com # 邮箱用户名
  pass: 邮箱密码或应用专用密码 # 邮箱密码或应用专用密码
  smtp:
    host: smtp.gmail.com # SMTP服务器地址
    port: 465 # SMTP服务器端口
    secure: true # SMTP服务器是否使用SSL/TLS
    enabled: false # SMTP服务器是否启用
  imap:
    enabled: true # IMAP服务器是否启用
    host: imap.gmail.com # IMAP服务器地址
    port: 993 # IMAP服务器端口
    secure: true # IMAP服务器是否使用SSL/TLS
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| user | 邮箱用户名，通常是您的Gmail地址 | 无 | 是 |
| pass | 邮箱密码或应用专用密码，建议使用应用专用密码 | 无 | 是 |
| smtp.host | SMTP服务器地址 | smtp.gmail.com | 当smtp.enabled为true时必填 |
| smtp.port | SMTP服务器端口 | 465 | 当smtp.enabled为true时必填 |
| smtp.secure | SMTP服务器是否使用SSL/TLS | true | 当smtp.enabled为true时必填 |
| smtp.enabled | 是否启用SMTP服务 | false | 是 |
| imap.enabled | 是否启用IMAP服务 | true | 是 |
| imap.host | IMAP服务器地址 | imap.gmail.com | 当imap.enabled为true时必填 |
| imap.port | IMAP服务器端口 | 993 | 当imap.enabled为true时必填 |
| imap.secure | IMAP服务器是否使用SSL/TLS | true | 当imap.enabled为true时必填 |

### 日志配置

日志配置部分定义了系统日志的存储和管理方式。

```yaml
logging:
  level: info # 日志级别
  path: logs # 日志路径
  maxSize: 10m # 日志文件大小上限
  maxFiles: 5 # 日志文件数量
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| level | 日志级别，可选值：debug、info、warn、error | info | 是 |
| path | 日志文件存储路径 | logs | 是 |
| maxSize | 单个日志文件的最大大小，支持单位：k、m、g | 10m | 是 |
| maxFiles | 保留的日志文件数量 | 5 | 是 |

### 管理员账号配置

管理员账号配置部分定义了系统管理员的用户名和密码。

```yaml
admin:
  username: 'admin' # 管理员用户名
  password: 'admin123' # 管理员密码
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| username | 管理员用户名 | admin | 是 |
| password | 管理员密码 | admin123 | 是 |

**注意**：出于安全考虑，请务必修改默认的管理员密码。

### JWT认证配置

JWT认证配置部分定义了系统使用的JWT令牌的密钥和过期时间。

```yaml
jwt:
  secret: "JWT密钥内容"  # JWT密钥
  expiresIn: "24h"      # 24小时过期
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| secret | JWT密钥，用于签名和验证JWT令牌 | 无 | 是 |
| expiresIn | JWT令牌的过期时间，支持的格式：60、"2 days"、"10h"、"7d" | "24h" | 是 |

**注意**：出于安全考虑，请使用强随机字符串作为JWT密钥。

### 登录限制配置

登录限制配置部分定义了系统的登录尝试限制，防止暴力破解。

```yaml
loginLimiter:
  maxAttempts: 5     # 最大尝试次数
  lockTime: 600000   # 锁定时间（10分钟，单位：毫秒）
```

| 参数 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| maxAttempts | 最大登录尝试次数，超过此次数将被锁定 | 5 | 是 |
| lockTime | 锁定时间，单位为毫秒，600000表示10分钟 | 600000 | 是 |

## 配置示例

以下是一个完整的配置示例：

```yaml
server:
  port: 3116 # 端口
  host: '0.0.0.0' # 地址
proxy:
  enabled: false # 代理设置
  host: 127.0.0.1 # 代理地址
  port: 10808 # 代理端口
  protocol: socks5 # 代理协议
cloudflare:
  - emailForward: Gmail用户名@gmail.com # 邮箱用户名
    domain: '@你的域名.com' # 域名
    apiToken: API令牌 # API令牌
    zoneId: zoneId # Zone ID
email:
  user: Gmail用户名@gmail.com # 邮箱用户名
  pass: 邮箱密码或应用专用密码 # 邮箱密码或应用专用密码
  smtp:
    host: smtp.gmail.com # SMTP服务器地址
    port: 465 # SMTP服务器端口
    secure: true # SMTP服务器是否使用SSL/TLS
    enabled: false # SMTP服务器是否启用
  imap:
    enabled: true # IMAP服务器是否启用
    host: imap.gmail.com # IMAP服务器地址
    port: 993 # IMAP服务器端口
    secure: true # IMAP服务器是否使用SSL/TLS
logging:
  level: info # 日志级别
  path: logs # 日志路径
  maxSize: 10m # 日志文件大小上限
  maxFiles: 5 # 日志文件数量
admin:
  username: 'admin' # 管理员用户名
  password: 'your-secure-password' # 管理员密码
jwt:
  secret: "your-jwt-secret-key"  # JWT密钥
  expiresIn: "24h"      # 24小时过期
loginLimiter:
  maxAttempts: 5     # 最大尝试次数
  lockTime: 600000   # 锁定时间（10分钟，单位：毫秒）
```

## 配置注意事项

1. **安全性**：
   - 请妥善保管配置文件，不要将其暴露在公共网络上
   - 使用强密码和JWT密钥
   - 定期更换密码和API令牌

2. **Cloudflare API令牌**：
   - 创建专用的API令牌，只授予必要的权限
   - 权限要求：Zone.Email Routing: Edit、Zone.DNS: Edit

3. **Gmail设置**：
   - 如果使用Gmail，请启用IMAP访问
   - 如果启用了两步验证，请使用应用专用密码
   - 应用专用密码可在[Google账号安全设置](https://myaccount.google.com/security)中创建

4. **代理设置**：
   - 如果您的服务器在中国大陆，可能需要配置代理以访问Gmail和Cloudflare API
   - 确保代理服务器稳定可靠

5. **多域名配置**：
   - 可以在cloudflare数组中添加多个域名配置
   - 每个域名需要单独的apiToken和zoneId

6. **日志管理**：
   - 定期检查日志文件
   - 根据服务器存储空间调整maxSize和maxFiles参数
