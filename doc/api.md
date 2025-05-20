# CloudflareMailServer API 文档

本文档提供了CloudflareMailServer系统的API接口说明，包括认证、账号管理和邮件操作等功能。

## 目录

- [认证](#认证)
  - [登录获取Token](#登录获取token)
  - [刷新Token](#刷新token)
- [账号管理](#账号管理)
  - [获取账号列表](#获取账号列表)
  - [获取账号详情](#获取账号详情)
  - [自动生成账号](#自动生成账号)
  - [手动创建账号](#手动创建账号)
  - [编辑账号](#编辑账号)
  - [删除账号](#删除账号)
  - [重置账号密码](#重置账号密码)
  - [同步账号与Cloudflare](#同步账号与cloudflare)
- [邮件操作](#邮件操作)
  - [获取邮件列表](#获取邮件列表)
  - [获取邮件详情](#获取邮件详情)
  - [标记邮件为已读](#标记邮件为已读)
  - [批量标记邮件为已读](#批量标记邮件为已读)
  - [获取邮件拉取进度](#获取邮件拉取进度)
  - [从IMAP服务器拉取新邮件](#从imap服务器拉取新邮件)

## 认证

所有API请求（除了登录接口）都需要在请求头中包含有效的JWT令牌进行认证。

### 登录获取Token

通过用户名和密码获取JWT令牌。

**请求方式**：POST

**URL**：`/api/auth/login`

**请求体**：
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h",
    "user": {
      "username": "admin",
      "isAdmin": true
    }
  }
}
```

### 刷新Token

使用当前有效的令牌获取新的令牌。

**请求方式**：POST

**URL**：`/api/auth/refresh`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

## 账号管理

### 获取账号列表

获取系统中的账号列表，支持分页、搜索和排序。

**请求方式**：GET

**URL**：`/api/accounts`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
- `page`：页码，从1开始，默认为1
- `pageSize`：每页数量，默认为10
- `search`：搜索关键词（搜索邮箱或用户名）
- `status`：状态过滤（active/inactive）
- `sortBy`：排序字段
- `sortOrder`：排序方向（asc/desc）

**响应示例**：
```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": 1,
        "username": "testuser",
        "email": "testuser@example.com",
        "is_active": 1,
        "created_at": 1621234567890,
        "last_accessed": 1621234567890
      }
    ],
    "pagination": {
      "current": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 获取账号详情

获取指定账号的详细信息。

**请求方式**：GET

**URL**：`/api/accounts/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "account": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "is_active": 1,
      "created_at": 1621234567890,
      "last_accessed": 1621234567890
    }
  }
}
```

### 自动生成账号

自动生成一个新账号。

**请求方式**：POST

**URL**：`/api/accounts/generate`

**请求头**：
```
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "domain": "example.com" // 可选，如果不提供则使用配置中的默认域名
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "account": {
      "id": 1,
      "username": "auto_generated_user",
      "email": "auto_generated_user@example.com",
      "password": "random_password",
      "is_active": 1,
      "created_at": 1621234567890
    }
  }
}
```

### 手动创建账号

手动创建一个新账号。

**请求方式**：POST

**URL**：`/api/accounts`

**请求头**：
```
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "username": "testuser",
  "domain": "example.com",
  "password": "password123" // 可选，如果不提供则自动生成
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "account": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "password123",
      "is_active": 1,
      "created_at": 1621234567890
    }
  }
}
```

### 编辑账号

编辑指定账号的信息。

**请求方式**：PUT

**URL**：`/api/accounts/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "username": "newusername", // 可选
  "password": "newpassword", // 可选
  "is_active": true // 可选
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "account": {
      "id": 1,
      "username": "newusername",
      "email": "testuser@example.com",
      "is_active": 1,
      "created_at": 1621234567890,
      "last_accessed": 1621234567890
    }
  }
}
```

### 删除账号

删除指定账号。

**请求方式**：DELETE

**URL**：`/api/accounts/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "message": "账号删除成功"
  }
}
```

### 重置账号密码

重置指定账号的密码。

**请求方式**：POST

**URL**：`/api/accounts/:id/reset-password`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "password": "new_random_password"
  }
}
```

### 同步账号与Cloudflare

同步本地账号与Cloudflare邮件路由。

**请求方式**：POST

**URL**：`/api/accounts/sync`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "message": "账号同步成功",
    "added": 5,
    "updated": 3,
    "removed": 1
  }
}
```

## 邮件操作

### 获取邮件列表

获取邮件列表，支持分页和过滤。

**请求方式**：GET

**URL**：`/api/emails/list`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
- `account`：邮箱账号，如果不提供则获取所有邮件（管理员权限）
- `page`：页码，从1开始，默认为1
- `limit`：每页数量，默认为20
- `sender`：发件人过滤
- `subject`：主题过滤
- `startDate`：开始日期过滤 (YYYY-MM-DD)
- `endDate`：结束日期过滤 (YYYY-MM-DD)
- `unreadOnly`：是否只显示未读邮件（true/false）

**响应示例**：
```json
{
  "success": true,
  "data": {
    "emails": [
      {
        "id": 1,
        "account": "testuser@example.com",
        "message_id": "<message-id>",
        "subject": "Test Email",
        "from": "sender@example.com",
        "date": 1621234567890,
        "is_read": 0,
        "has_attachments": 1
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 获取邮件详情

获取指定邮件的详细信息。

**请求方式**：GET

**URL**：`/api/emails/:id`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "email": {
      "id": 1,
      "account": "testuser@example.com",
      "message_id": "<message-id>",
      "subject": "Test Email",
      "from": "sender@example.com",
      "date": 1621234567890,
      "is_read": 0,
      "has_attachments": 1,
      "content": "邮件内容..."
    }
  }
}
```

### 标记邮件为已读

标记指定邮件为已读。

**请求方式**：PUT

**URL**：`/api/emails/:id/read`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "message": "邮件已标记为已读"
  }
}
```

### 批量标记邮件为已读

批量标记多个邮件为已读。

**请求方式**：PUT

**URL**：`/api/emails/batch/read`

**请求头**：
```
Authorization: Bearer <token>
```

**请求体**：
```json
{
  "ids": [1, 2, 3]
}
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "message": "邮件已批量标记为已读",
    "count": 3
  }
}
```

### 获取邮件拉取进度

获取当前邮件拉取的进度信息。

**请求方式**：GET

**URL**：`/api/emails/check-status`

**请求头**：
```
Authorization: Bearer <token>
```

**响应示例**：
```json
{
  "isRunning": true,
  "step": 2,
  "progress": 45,
  "message": "处理邮件 5/10...",
  "processedEmails": 5,
  "totalEmails": 10,
  "processedAccounts": 1,
  "totalAccounts": 3
}
```

### 从IMAP服务器拉取新邮件

触发从IMAP服务器拉取新邮件的操作。

**请求方式**：POST

**URL**：`/api/emails/check`

**请求头**：
```
Authorization: Bearer <token>
```

**查询参数**：
- `account`：邮箱账号，如果不提供则检查所有邮箱（管理员权限）

**响应示例**：
```json
{
  "success": true,
  "message": "邮件拉取已开始"
}
```

## 错误处理

所有API在发生错误时都会返回相应的HTTP状态码和错误信息。

**错误响应示例**：
```json
{
  "success": false,
  "error": "错误信息",
  "message": "详细错误描述（仅在开发环境中提供）"
}
```

常见HTTP状态码：
- 400：请求参数错误
- 401：未认证或认证失败
- 403：权限不足
- 404：资源不存在
- 429：请求过于频繁
- 500：服务器内部错误
