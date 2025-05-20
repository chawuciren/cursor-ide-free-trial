const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const { getConfig } = require('./config');
const logger = require('./logger');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(process.cwd(), 'data', 'database.sqlite');
    }

    async initialize() {
        try {
            if (this.db) {
                return;
            }

            // 确保数据目录存在
            const dataDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
                logger.info(`创建数据目录: ${dataDir}`);
            }

            // 打开数据库连接
            this.db = await open({
                filename: this.dbPath,
                driver: sqlite3.Database
            });

            logger.info(`SQLite数据库连接成功: ${this.dbPath}`);

            // 创建必要的表（如果不存在）
            await this.createTables();

            // 执行数据库迁移
            await this.migrateDatabase();
        } catch (error) {
            logger.error('数据库连接失败:', error);
            throw error;
        }
    }

    async createTables() {
        // 创建账号表
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                domain TEXT NOT NULL,
                password TEXT,
                created_at INTEGER NOT NULL,
                last_accessed INTEGER,
                status TEXT DEFAULT 'active',
                notes TEXT
            )
        `);

        // 创建邮件表
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account TEXT NOT NULL,
                message_id TEXT,
                sender TEXT NOT NULL,
                sender_name TEXT,
                subject TEXT,
                preview TEXT,
                body TEXT,
                date INTEGER NOT NULL,
                is_read INTEGER DEFAULT 0,
                has_attachments INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (account) REFERENCES accounts(email) ON DELETE CASCADE
            )
        `);

        // 创建邮件附件表
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS email_attachments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                size INTEGER NOT NULL,
                type TEXT,
                path TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
            )
        `);

        // 创建活动记录表
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                icon TEXT NOT NULL,
                text TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                related_id TEXT,
                details TEXT
            )
        `);

        logger.info('数据库表创建完成');
    }

    // 账号相关方法
    async getAllAccounts() {
        try {
            const accounts = await this.db.all(
                `SELECT id, email, username, domain, password, created_at, last_accessed, status, notes
                 FROM accounts
                 ORDER BY created_at DESC`
            );

            // 格式化日期
            return accounts.map(account => ({
                ...account,
                created_at: this.formatDate(account.created_at)
            }));
        } catch (error) {
            logger.error('获取所有账号失败', error);
            throw error;
        }
    }

    /**
     * 获取分页账号列表
     * @param {number} page - 页码，从1开始
     * @param {number} pageSize - 每页数量
     * @param {Object} filters - 筛选条件
     * @returns {Promise<{accounts: Array, total: number, pages: number}>} - 分页结果
     */
    async getAccountsPaginated(page = 1, pageSize = 10, filters = {}) {
        try {
            // 构建查询条件
            let whereClause = '';
            const params = [];

            if (filters.domain && filters.domain !== 'all') {
                whereClause += 'domain = ? ';
                params.push(filters.domain);
            }

            if (filters.status && filters.status !== 'all') {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'status = ? ';
                params.push(filters.status);
            }

            if (filters.search) {
                if (whereClause) whereClause += 'AND ';
                whereClause += '(email LIKE ? OR username LIKE ?) ';
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            if (whereClause) {
                whereClause = 'WHERE ' + whereClause;
            }

            // 获取总数
            const countQuery = `SELECT COUNT(*) as total FROM accounts ${whereClause}`;
            const countResult = await this.db.get(countQuery, params);
            const total = countResult.total;

            // 计算总页数
            const pages = Math.ceil(total / pageSize);

            // 计算偏移量
            const offset = (page - 1) * pageSize;

            // 获取当前页数据
            const query = `
                SELECT id, email, username, domain, password, created_at, last_accessed, status, notes
                FROM accounts
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT ? OFFSET ?
            `;

            const accounts = await this.db.all(query, [...params, pageSize, offset]);

            // 格式化日期
            const formattedAccounts = accounts.map(account => ({
                ...account,
                created_at: this.formatDate(account.created_at)
            }));

            return {
                accounts: formattedAccounts,
                total,
                pages
            };
        } catch (error) {
            logger.error('获取分页账号列表失败', error);
            throw error;
        }
    }

    async getAccountById(id) {
        try {
            const account = await this.db.get(
                `SELECT id, email, username, domain, password, created_at, last_accessed, status, notes
                 FROM accounts
                 WHERE id = ?`,
                [id]
            );

            if (account) {
                account.created_at = this.formatDate(account.created_at);
            }

            return account;
        } catch (error) {
            logger.error(`获取账号失败: ID=${id}`, error);
            throw error;
        }
    }

    async getAccountByEmail(email) {
        try {
            const account = await this.db.get(
                `SELECT id, email, username, domain, password, created_at, last_accessed, status, notes
                 FROM accounts
                 WHERE email = ?`,
                [email]
            );

            if (account) {
                account.created_at = this.formatDate(account.created_at);
            }

            return account;
        } catch (error) {
            logger.error(`获取账号失败: email=${email}`, error);
            throw error;
        }
    }

    /**
     * 更新账号最后访问时间
     * @param {number} id - 账号ID
     * @returns {Promise<boolean>} - 更新是否成功
     */
    async updateAccountLastAccessed(id) {
        try {
            const now = Date.now();
            await this.db.run(
                `UPDATE accounts SET last_accessed = ? WHERE id = ?`,
                [now, id]
            );
            logger.info(`更新账号最后访问时间成功: ID=${id}`);
            return true;
        } catch (error) {
            logger.error(`更新账号最后访问时间失败: ID=${id}`, error);
            throw error;
        }
    }

    /**
     * 创建账号
     * @param {string} email - 邮箱地址
     * @param {string} username - 用户名
     * @param {string} domain - 域名
     * @param {string} notes - 备注
     * @param {string} password - 密码，如果为null则自动生成
     * @param {string} status - 账号状态，默认为'active'
     * @returns {Promise<Object>} - 创建的账号信息
     */
    async createAccount(email, username, domain, notes = '', password = null, status = 'active') {
        try {
            const now = Date.now();
            const StringHelper = require('./string-helper');

            // 如果没有提供密码，则生成一个随机密码
            if (!password) {
                password = StringHelper.generateRandomPassword();
            }

            // 确保状态值有效
            if (status !== 'active' && status !== 'inactive') {
                status = 'active'; // 默认为活跃状态
            }

            const result = await this.db.run(
                `INSERT INTO accounts (email, username, domain, password, created_at, status, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [email, username, domain, password, now, status, notes]
            );

            logger.info(`创建账号成功: ${email}, 状态: ${status}`);

            // 添加活动记录
            await this.addActivity(
                'account_create',
                'person-plus',
                `创建了新账号 ${email}`,
                result.lastID,
                { email, username, domain, status }
            );

            return {
                id: result.lastID,
                email,
                username,
                domain,
                password,
                created_at: now,
                status,
                notes
            };
        } catch (error) {
            logger.error(`创建账号失败: ${email}`, error);
            throw error;
        }
    }

    async updateAccount(id, updateData) {
        try {
            const allowedFields = ['status', 'notes', 'last_accessed', 'password'];
            const updates = [];
            const values = [];

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key)) {
                    updates.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (updates.length === 0) {
                return false;
            }

            values.push(id);

            const result = await this.db.run(
                `UPDATE accounts SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            // 如果更新成功且包含状态更新，添加活动记录
            if (result.changes > 0) {
                if (updateData.status) {
                    // 获取账号信息
                    const account = await this.getAccountById(id);
                    if (account) {
                        const statusText = updateData.status === 'active' ? '激活' : '禁用';
                        await this.addActivity(
                            'account_update',
                            'gear',
                            `${statusText}了账号 ${account.email}`,
                            id,
                            { email: account.email, status: updateData.status }
                        );
                    }
                }

                // 如果更新了密码
                if (updateData.password) {
                    const account = await this.getAccountById(id);
                    if (account) {
                        await this.addActivity(
                            'account_update',
                            'key',
                            `更新了账号 ${account.email} 的密码`,
                            id,
                            { email: account.email }
                        );
                    }
                }
            }

            return result.changes > 0;
        } catch (error) {
            logger.error(`更新账号失败: ID=${id}`, error);
            throw error;
        }
    }

    /**
     * 重置账号密码
     * @param {number} id - 账号ID
     * @returns {Promise<{success: boolean, password?: string}>} - 操作结果
     */
    async resetAccountPassword(id) {
        try {
            const StringHelper = require('./string-helper');
            const newPassword = StringHelper.generateRandomPassword();

            const result = await this.updateAccount(id, { password: newPassword });

            if (result) {
                logger.info(`重置账号密码成功: ID=${id}`);
                return { success: true, password: newPassword };
            } else {
                logger.warn(`重置账号密码失败: ID=${id}, 账号不存在`);
                return { success: false };
            }
        } catch (error) {
            logger.error(`重置账号密码失败: ID=${id}`, error);
            return { success: false };
        }
    }

    /**
     * 执行数据库迁移
     * 检查并更新表结构
     */
    async migrateDatabase() {
        try {
            logger.info('检查数据库表结构...');

            // 获取accounts表的列信息
            const tableInfo = await this.db.all("PRAGMA table_info(accounts)");

            // 检查是否存在password列
            const hasPasswordColumn = tableInfo.some(column => column.name === 'password');

            if (!hasPasswordColumn) {
                logger.info('正在添加password列到accounts表...');
                await this.db.exec('ALTER TABLE accounts ADD COLUMN password TEXT');

                // 为现有账号生成随机密码
                const StringHelper = require('./string-helper');
                const accounts = await this.db.all('SELECT id FROM accounts');

                for (const account of accounts) {
                    const password = StringHelper.generateRandomPassword();
                    await this.db.run(
                        'UPDATE accounts SET password = ? WHERE id = ?',
                        [password, account.id]
                    );
                }

                logger.info('数据库迁移完成: 已添加password列并为现有账号生成密码');
            } else {
                logger.info('数据库结构已是最新');
            }

            // 检查是否存在activities表
            try {
                await this.db.get('SELECT 1 FROM activities LIMIT 1');
                logger.info('活动记录表已存在');
            } catch (error) {
                logger.info('创建活动记录表');
                await this.db.exec(`
                    CREATE TABLE IF NOT EXISTS activities (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        type TEXT NOT NULL,
                        icon TEXT NOT NULL,
                        text TEXT NOT NULL,
                        timestamp INTEGER NOT NULL,
                        related_id TEXT,
                        details TEXT
                    )
                `);
            }
        } catch (error) {
            logger.error('数据库迁移失败:', error);
            throw error;
        }
    }

    async deleteAccount(id) {
        try {
            // 先获取账号信息，用于记录活动
            const account = await this.getAccountById(id);

            const result = await this.db.run(
                'DELETE FROM accounts WHERE id = ?',
                [id]
            );

            // 如果删除成功且有账号信息，添加活动记录
            if (result.changes > 0 && account) {
                await this.addActivity(
                    'account_delete',
                    'trash',
                    `删除了账号 ${account.email}`,
                    null,
                    { email: account.email, domain: account.domain }
                );
            }

            return result.changes > 0;
        } catch (error) {
            logger.error(`删除账号失败: ID=${id}`, error);
            throw error;
        }
    }

    // 辅助方法
    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    }

    // 邮件相关方法
    /**
     * 获取所有邮件（不分页）
     * @param {Object} filters - 筛选条件
     * @returns {Promise<Array>} - 邮件列表
     * @deprecated 请使用 getEmailsPaginated 方法代替
     */
    async getAllEmails(filters = {}) {
        try {
            // 构建查询条件
            let whereClause = '';
            const params = [];

            if (filters.account && filters.account !== 'all') {
                whereClause += 'account LIKE ? ';
                params.push(`%${filters.account}%`);
            }

            if (filters.sender) {
                if (whereClause) whereClause += 'AND ';
                whereClause += '(sender LIKE ? OR sender_name LIKE ?) ';
                params.push(`%${filters.sender}%`, `%${filters.sender}%`);
            }

            if (filters.subject) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'subject LIKE ? ';
                params.push(`%${filters.subject}%`);
            }

            if (filters.status && filters.status !== 'all') {
                if (whereClause) whereClause += 'AND ';
                if (filters.status === 'read') {
                    whereClause += 'is_read = 1 ';
                } else if (filters.status === 'unread') {
                    whereClause += 'is_read = 0 ';
                }
            }

            if (filters.hasAttachments && filters.hasAttachments !== 'all') {
                if (whereClause) whereClause += 'AND ';
                if (filters.hasAttachments === 'yes') {
                    whereClause += 'has_attachments = 1 ';
                } else if (filters.hasAttachments === 'no') {
                    whereClause += 'has_attachments = 0 ';
                }
            }

            // 处理日期范围筛选
            if (filters.startDate) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'date >= ? ';
                // 将日期字符串转换为时间戳
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0); // 设置为当天开始时间
                params.push(startDate.getTime());
            }

            if (filters.endDate) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'date <= ? ';
                // 将日期字符串转换为时间戳，并设置为当天结束时间
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
                params.push(endDate.getTime());
            }

            // 保留原有的日期筛选逻辑，作为备选
            if (!filters.startDate && !filters.endDate && filters.date && filters.date !== 'all') {
                if (whereClause) whereClause += 'AND ';
                const now = new Date();

                if (filters.date === 'today') {
                    // 今天的开始时间（00:00:00）
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfDay);
                } else if (filters.date === 'week') {
                    // 本周的开始时间（周日或周一，取决于地区）
                    const day = now.getDay(); // 0是周日，1-6是周一到周六
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfWeek);
                } else if (filters.date === 'month') {
                    // 本月的开始时间
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfMonth);
                }
            }

            if (filters.search) {
                if (whereClause) whereClause += 'AND ';
                whereClause += '(subject LIKE ? OR sender LIKE ? OR sender_name LIKE ? OR preview LIKE ? OR account LIKE ?) ';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }

            if (whereClause) {
                whereClause = 'WHERE ' + whereClause;
            }

            const query = `
                SELECT id, account, message_id, sender, sender_name, subject, preview, date, is_read, has_attachments
                FROM emails
                ${whereClause}
                ORDER BY date DESC
            `;

            const emails = await this.db.all(query, params);

            // 格式化日期
            return emails.map(email => ({
                ...email,
                date: this.formatDateTime(email.date),
                is_read: !!email.is_read,
                has_attachments: !!email.has_attachments
            }));
        } catch (error) {
            logger.error('获取邮件列表失败', error);
            throw error;
        }
    }

    /**
     * 获取分页邮件列表
     * @param {number} page - 页码，从1开始
     * @param {number} pageSize - 每页数量
     * @param {Object} filters - 筛选条件
     * @returns {Promise<{emails: Array, total: number, pages: number}>} - 分页结果
     */
    async getEmailsPaginated(page = 1, pageSize = 10, filters = {}) {
        try {
            // 构建查询条件
            let whereClause = '';
            const params = [];

            if (filters.account && filters.account !== 'all') {
                whereClause += 'account LIKE ? ';
                params.push(`%${filters.account}%`);
            }

            if (filters.sender) {
                if (whereClause) whereClause += 'AND ';
                whereClause += '(sender LIKE ? OR sender_name LIKE ?) ';
                params.push(`%${filters.sender}%`, `%${filters.sender}%`);
            }

            if (filters.subject) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'subject LIKE ? ';
                params.push(`%${filters.subject}%`);
            }

            if (filters.status && filters.status !== 'all') {
                if (whereClause) whereClause += 'AND ';
                if (filters.status === 'read') {
                    whereClause += 'is_read = 1 ';
                } else if (filters.status === 'unread') {
                    whereClause += 'is_read = 0 ';
                }
            }

            if (filters.hasAttachments && filters.hasAttachments !== 'all') {
                if (whereClause) whereClause += 'AND ';
                if (filters.hasAttachments === 'yes') {
                    whereClause += 'has_attachments = 1 ';
                } else if (filters.hasAttachments === 'no') {
                    whereClause += 'has_attachments = 0 ';
                }
            }

            // 处理日期范围筛选
            if (filters.startDate) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'date >= ? ';
                // 将日期字符串转换为时间戳
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0); // 设置为当天开始时间
                params.push(startDate.getTime());
            }

            if (filters.endDate) {
                if (whereClause) whereClause += 'AND ';
                whereClause += 'date <= ? ';
                // 将日期字符串转换为时间戳，并设置为当天结束时间
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
                params.push(endDate.getTime());
            }

            // 保留原有的日期筛选逻辑，作为备选
            if (!filters.startDate && !filters.endDate && filters.date && filters.date !== 'all') {
                if (whereClause) whereClause += 'AND ';
                const now = new Date();

                if (filters.date === 'today') {
                    // 今天的开始时间（00:00:00）
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfDay);
                } else if (filters.date === 'week') {
                    // 本周的开始时间（周日或周一，取决于地区）
                    const day = now.getDay(); // 0是周日，1-6是周一到周六
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfWeek);
                } else if (filters.date === 'month') {
                    // 本月的开始时间
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    whereClause += 'date >= ? ';
                    params.push(startOfMonth);
                }
            }

            if (filters.search) {
                if (whereClause) whereClause += 'AND ';
                whereClause += '(subject LIKE ? OR sender LIKE ? OR sender_name LIKE ? OR preview LIKE ? OR account LIKE ?) ';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }

            if (whereClause) {
                whereClause = 'WHERE ' + whereClause;
            }

            // 获取总数
            const countQuery = `SELECT COUNT(*) as total FROM emails ${whereClause}`;
            const countResult = await this.db.get(countQuery, params);
            const total = countResult.total;

            // 计算总页数
            const pages = Math.ceil(total / pageSize);

            // 计算偏移量
            const offset = (page - 1) * pageSize;

            // 获取当前页数据
            const query = `
                SELECT id, account, message_id, sender, sender_name, subject, preview, date, is_read, has_attachments
                FROM emails
                ${whereClause}
                ORDER BY date DESC
                LIMIT ? OFFSET ?
            `;

            const emails = await this.db.all(query, [...params, pageSize, offset]);

            // 格式化日期
            const formattedEmails = emails.map(email => ({
                ...email,
                date: this.formatDateTime(email.date),
                is_read: !!email.is_read,
                has_attachments: !!email.has_attachments
            }));

            return {
                emails: formattedEmails,
                total,
                pages
            };
        } catch (error) {
            logger.error('获取分页邮件列表失败', error);
            throw error;
        }
    }

    async getEmailById(id) {
        try {
            const email = await this.db.get(
                `SELECT id, account, message_id, sender, sender_name, subject, body, date, is_read, has_attachments
                 FROM emails
                 WHERE id = ?`,
                [id]
            );

            if (!email) {
                return null;
            }

            // 格式化日期
            email.date = this.formatDateTime(email.date);
            email.is_read = !!email.is_read;
            email.has_attachments = !!email.has_attachments;

            // 获取附件
            if (email.has_attachments) {
                email.attachments = await this.getEmailAttachments(id);
            } else {
                email.attachments = [];
            }

            return email;
        } catch (error) {
            logger.error(`获取邮件失败: ID=${id}`, error);
            throw error;
        }
    }

    async getEmailAttachments(emailId) {
        try {
            const attachments = await this.db.all(
                `SELECT id, name, size, type, path
                 FROM email_attachments
                 WHERE email_id = ?
                 ORDER BY id ASC`,
                [emailId]
            );

            return attachments;
        } catch (error) {
            logger.error(`获取邮件附件失败: emailId=${emailId}`, error);
            throw error;
        }
    }

    /**
     * 获取指定账号已存在的所有邮件ID
     * @param {string} account - 邮箱账号
     * @returns {Promise<Array<string>>} - 邮件ID列表
     */
    async getExistingMessageIdsForAccount(account) {
        try {
            logger.info(`获取账号 ${account} 已存在的邮件ID列表`);

            const results = await this.db.all(
                'SELECT message_id FROM emails WHERE account = ?',
                [account]
            );

            // 过滤掉null或空值，并规范化ID（去除尖括号和空格）
            const messageIds = results
                .map(row => row.message_id)
                .filter(id => id)
                .map(id => id.replace(/[<>\s]/g, ''));

            logger.info(`账号 ${account} 已有 ${messageIds.length} 封邮件记录`);
            if (messageIds.length > 0) {
                logger.info(`前5个邮件ID: ${JSON.stringify(messageIds.slice(0, 5))}`);
            }

            return messageIds;
        } catch (error) {
            logger.error(`获取账号已存在邮件ID失败: account=${account}`, error);
            return [];
        }
    }

    /**
     * 获取指定账号的最后一封邮件日期
     * @param {string} account - 邮箱账号
     * @returns {Promise<number|null>} - 最后一封邮件的时间戳，如果没有邮件则返回null
     */
    async getLastEmailDateForAccount(account) {
        try {
            const result = await this.db.get(
                'SELECT MAX(date) as last_date FROM emails WHERE account = ?',
                [account]
            );

            return result && result.last_date ? result.last_date : null;
        } catch (error) {
            logger.error(`获取账号最后邮件日期失败: account=${account}`, error);
            return null;
        }
    }

    /**
     * 获取所有邮件中最新的日期
     * @returns {Promise<number|null>} - 最后一封邮件的时间戳，如果没有邮件则返回null
     */
    async getLastEmailDate() {
        try {
            const result = await this.db.get('SELECT MAX(date) as last_date FROM emails');

            const lastDate = result && result.last_date ? result.last_date : null;
            logger.info(`数据库中最后一封邮件的日期: ${lastDate ? new Date(lastDate).toISOString() : 'null'}`);

            return lastDate;
        } catch (error) {
            logger.error('获取最后邮件日期失败:', error);
            return null;
        }
    }

    /**
     * 检查邮件是否已存在
     * @param {string} account - 邮箱账号
     * @param {string} messageId - 邮件ID
     * @returns {Promise<boolean>} - 是否存在
     */
    async checkEmailExists(account, messageId) {
        try {
            const existingEmail = await this.db.get(
                'SELECT id FROM emails WHERE message_id = ? AND account = ?',
                [messageId, account]
            );

            return !!existingEmail;
        } catch (error) {
            logger.error(`检查邮件是否存在失败: account=${account}, messageId=${messageId}`, error);
            return false;
        }
    }

    async saveEmail(emailData) {
        try {
            const now = Date.now();
            const { account, message_id, sender, sender_name, subject, preview, body, date, attachments } = emailData;

            // 规范化邮件ID，去除尖括号和空格
            const normalizedMessageId = message_id ? message_id.replace(/[<>\s]/g, '') : '';
            logger.info(`保存邮件: ${message_id}, 规范化后: ${normalizedMessageId}`);

            // 检查邮件是否已存在 - 使用规范化后的ID
            const exists = await this.checkEmailExists(account, normalizedMessageId);

            if (exists) {
                logger.info(`邮件已存在，跳过保存: ${message_id}`);
                return null;
            }

            // 使用规范化后的message_id保存

            // 保存邮件 - 使用规范化后的message_id
            const result = await this.db.run(
                `INSERT INTO emails (
                    account, message_id, sender, sender_name, subject, preview, body,
                    date, is_read, has_attachments, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    account,
                    normalizedMessageId, // 使用规范化后的ID
                    sender,
                    sender_name || '',
                    subject || '',
                    preview || '',
                    body || '',
                    date || now,
                    0,
                    attachments && attachments.length > 0 ? 1 : 0,
                    now
                ]
            );

            const emailId = result.lastID;

            // 保存附件
            if (attachments && attachments.length > 0) {
                for (const attachment of attachments) {
                    await this.saveEmailAttachment(emailId, attachment);
                }
            }

            logger.info(`邮件保存成功: ${message_id}`);

            // 添加活动记录
            await this.addActivity(
                'email_receive',
                'envelope',
                `收到新邮件 - 来自 ${sender_name || sender}`,
                emailId,
                { account, subject, sender }
            );

            return emailId;
        } catch (error) {
            logger.error('保存邮件失败', error);
            throw error;
        }
    }

    async saveEmailAttachment(emailId, attachment) {
        try {
            const now = Date.now();
            const { name, size, type, path } = attachment;

            const result = await this.db.run(
                `INSERT INTO email_attachments (email_id, name, size, type, path, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [emailId, name, size, type || '', path, now]
            );

            return result.lastID;
        } catch (error) {
            logger.error(`保存邮件附件失败: emailId=${emailId}`, error);
            throw error;
        }
    }

    async markEmailAsRead(id) {
        try {
            // 先获取邮件信息，用于记录活动
            const email = await this.getEmailById(id);

            const result = await this.db.run(
                'UPDATE emails SET is_read = 1 WHERE id = ?',
                [id]
            );

            // 如果更新成功且有邮件信息，添加活动记录
            if (result.changes > 0 && email) {
                await this.addActivity(
                    'email_read',
                    'check2-circle',
                    `阅读了邮件 - ${email.subject || '无主题'}`,
                    id,
                    { account: email.account, sender: email.sender, subject: email.subject }
                );
            }

            return result.changes > 0;
        } catch (error) {
            logger.error(`标记邮件为已读失败: ID=${id}`, error);
            throw error;
        }
    }

    /**
     * 批量标记邮件为已读
     * @param {Array<number>} ids - 邮件ID数组
     * @returns {Promise<number>} - 更新的邮件数量
     */
    async markEmailsAsRead(ids) {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                return 0;
            }

            // 构建IN子句的参数占位符
            const placeholders = ids.map(() => '?').join(',');

            // 更新邮件为已读
            const result = await this.db.run(
                `UPDATE emails SET is_read = 1 WHERE id IN (${placeholders})`,
                ids
            );

            logger.info(`批量标记邮件为已读: 更新了 ${result.changes} 封邮件`);

            // 添加活动记录
            if (result.changes > 0) {
                await this.addActivity(
                    'email_batch_read',
                    'check2-all',
                    `批量标记 ${result.changes} 封邮件为已读`,
                    null,
                    { count: result.changes, ids }
                );
            }

            return result.changes;
        } catch (error) {
            logger.error('批量标记邮件为已读失败:', error);
            throw error;
        }
    }

    /**
     * 根据筛选条件将邮件标记为已读
     * @param {Object} filters - 筛选条件
     * @returns {Promise<{success: boolean, count: number}>} - 操作结果和更新的邮件数量
     */
    async markEmailsAsReadByFilters(filters = {}) {
        try {
            // 构建查询条件
            let whereClause = 'is_read = 0'; // 只更新未读邮件
            const params = [];

            if (filters.account && filters.account !== 'all') {
                whereClause += ' AND account LIKE ?';
                params.push(`%${filters.account}%`);
            }

            if (filters.sender) {
                whereClause += ' AND (sender LIKE ? OR sender_name LIKE ?)';
                params.push(`%${filters.sender}%`, `%${filters.sender}%`);
            }

            if (filters.subject) {
                whereClause += ' AND subject LIKE ?';
                params.push(`%${filters.subject}%`);
            }

            if (filters.hasAttachments && filters.hasAttachments !== 'all') {
                if (filters.hasAttachments === 'yes') {
                    whereClause += ' AND has_attachments = 1';
                } else if (filters.hasAttachments === 'no') {
                    whereClause += ' AND has_attachments = 0';
                }
            }

            // 处理日期范围筛选
            if (filters.startDate) {
                whereClause += ' AND date >= ?';
                // 将日期字符串转换为时间戳
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0); // 设置为当天开始时间
                params.push(startDate.getTime());
            }

            if (filters.endDate) {
                whereClause += ' AND date <= ?';
                // 将日期字符串转换为时间戳，并设置为当天结束时间
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间
                params.push(endDate.getTime());
            }

            // 保留原有的日期筛选逻辑，作为备选
            if (!filters.startDate && !filters.endDate && filters.date && filters.date !== 'all') {
                const now = new Date();

                if (filters.date === 'today') {
                    // 今天的开始时间（00:00:00）
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    whereClause += ' AND date >= ?';
                    params.push(startOfDay);
                } else if (filters.date === 'week') {
                    // 本周的开始时间（周日或周一，取决于地区）
                    const day = now.getDay(); // 0是周日，1-6是周一到周六
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff).getTime();
                    whereClause += ' AND date >= ?';
                    params.push(startOfWeek);
                } else if (filters.date === 'month') {
                    // 本月的开始时间
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    whereClause += ' AND date >= ?';
                    params.push(startOfMonth);
                }
            }

            if (filters.search) {
                whereClause += ' AND (subject LIKE ? OR sender LIKE ? OR sender_name LIKE ? OR preview LIKE ? OR account LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
            }

            // 先获取符合条件的未读邮件数量
            const countQuery = `SELECT COUNT(*) as count FROM emails WHERE ${whereClause}`;
            const countResult = await this.db.get(countQuery, params);
            const count = countResult.count;

            // 如果没有符合条件的未读邮件，直接返回
            if (count === 0) {
                return { success: true, count: 0 };
            }

            // 更新符合条件的邮件为已读
            const updateQuery = `UPDATE emails SET is_read = 1 WHERE ${whereClause}`;
            const result = await this.db.run(updateQuery, params);

            logger.info(`批量标记邮件为已读: 更新了 ${result.changes} 封邮件`);

            // 添加活动记录
            if (result.changes > 0) {
                await this.addActivity(
                    'email_batch_read',
                    'check2-all',
                    `批量标记 ${result.changes} 封邮件为已读`,
                    null,
                    { count: result.changes, filters }
                );
            }

            return { success: true, count: result.changes };
        } catch (error) {
            logger.error('批量标记邮件为已读失败:', error);
            return { success: false, count: 0, error: error.message };
        }
    }

    async deleteEmail(id) {
        try {
            // 先获取邮件信息，用于记录活动
            const email = await this.getEmailById(id);

            const result = await this.db.run(
                'DELETE FROM emails WHERE id = ?',
                [id]
            );

            // 如果删除成功且有邮件信息，添加活动记录
            if (result.changes > 0 && email) {
                await this.addActivity(
                    'email_delete',
                    'trash',
                    `删除了邮件 - ${email.subject || '无主题'}`,
                    null,
                    { account: email.account, sender: email.sender, subject: email.subject }
                );
            }

            return result.changes > 0;
        } catch (error) {
            logger.error(`删除邮件失败: ID=${id}`, error);
            throw error;
        }
    }

    /**
     * 获取最后一封邮件的日期
     * @param {string} [account] - 可选的账号过滤
     * @returns {Promise<number|null>} - 最后一封邮件的时间戳，如果没有邮件则返回null
     */
    async getLastEmailDate(account = null) {
        try {
            let query = 'SELECT MAX(date) as lastDate FROM emails';
            const params = [];

            if (account) {
                query += ' WHERE account = ?';
                params.push(account);
            }

            const result = await this.db.get(query, params);
            return result.lastDate || null;
        } catch (error) {
            logger.error('获取最后邮件日期失败:', error);
            return null;
        }
    }

    /**
     * 获取邮件总数
     * @param {string} [account] - 可选的账号过滤
     * @returns {Promise<number>} - 邮件总数
     */
    async getEmailCount(account = null) {
        try {
            let query = 'SELECT COUNT(*) as count FROM emails';
            const params = [];

            if (account) {
                query += ' WHERE account = ?';
                params.push(account);
            }

            const result = await this.db.get(query, params);
            return result.count || 0;
        } catch (error) {
            logger.error('获取邮件总数失败:', error);
            return 0;
        }
    }

    /**
     * 根据账号和消息ID获取邮件
     * @param {string} account - 邮箱账号
     * @param {string} messageId - 邮件ID
     * @returns {Promise<Object|null>} - 邮件对象，如果不存在则返回null
     */
    async getEmailByMessageId(account, messageId) {
        try {
            const email = await this.db.get(
                'SELECT * FROM emails WHERE account = ? AND message_id = ?',
                [account, messageId]
            );

            if (!email) return null;

            // 处理附件
            if (email.attachments) {
                try {
                    email.attachments = JSON.parse(email.attachments);
                } catch (e) {
                    email.attachments = [];
                }
            } else {
                email.attachments = [];
            }

            // 添加格式化日期
            email.formatted_date = this.formatDateTime(email.date);

            return email;
        } catch (error) {
            logger.error(`获取邮件失败: account=${account}, messageId=${messageId}`, error);
            return null;
        }
    }

    // 格式化日期时间
    formatDateTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/\//g, '-');
    }

    // 活动记录相关方法
    /**
     * 添加活动记录
     * @param {string} type - 活动类型，如'account_create', 'email_receive', 'system'等
     * @param {string} icon - 图标名称，如'envelope', 'person-plus'等
     * @param {string} text - 活动描述文本
     * @param {string} relatedId - 相关ID，如账号ID、邮件ID等
     * @param {Object} details - 详细信息，会被转换为JSON字符串
     * @returns {Promise<number>} - 新记录的ID
     */
    async addActivity(type, icon, text, relatedId = null, details = null) {
        try {
            const now = Date.now();
            const detailsJson = details ? JSON.stringify(details) : null;

            const result = await this.db.run(
                `INSERT INTO activities (type, icon, text, timestamp, related_id, details)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [type, icon, text, now, relatedId, detailsJson]
            );

            logger.info(`添加活动记录成功: ${type} - ${text}`);
            return result.lastID;
        } catch (error) {
            logger.error('添加活动记录失败:', error);
            // 不抛出异常，避免影响主要业务流程
            return null;
        }
    }

    /**
     * 获取最近活动记录
     * @param {number} limit - 返回记录数量限制
     * @returns {Promise<Array>} - 活动记录列表
     */
    async getRecentActivities(limit = 10) {
        try {
            const activities = await this.db.all(
                `SELECT id, type, icon, text, timestamp, related_id, details
                 FROM activities
                 ORDER BY timestamp DESC
                 LIMIT ?`,
                [limit]
            );

            // 格式化时间戳为相对时间
            return activities.map(activity => ({
                ...activity,
                time: this.formatRelativeTime(activity.timestamp),
                details: activity.details ? JSON.parse(activity.details) : null
            }));
        } catch (error) {
            logger.error('获取最近活动记录失败:', error);
            return [];
        }
    }

    /**
     * 获取特定类型的活动记录
     * @param {string} type - 活动类型
     * @param {number} limit - 返回记录数量限制
     * @returns {Promise<Array>} - 活动记录列表
     */
    async getActivitiesByType(type, limit = 10) {
        try {
            const activities = await this.db.all(
                `SELECT id, type, icon, text, timestamp, related_id, details
                 FROM activities
                 WHERE type = ?
                 ORDER BY timestamp DESC
                 LIMIT ?`,
                [type, limit]
            );

            // 格式化时间戳为相对时间
            return activities.map(activity => ({
                ...activity,
                time: this.formatRelativeTime(activity.timestamp),
                details: activity.details ? JSON.parse(activity.details) : null
            }));
        } catch (error) {
            logger.error(`获取类型为 ${type} 的活动记录失败:`, error);
            return [];
        }
    }

    /**
     * 清空所有活动记录
     * @returns {Promise<Object>} - 清空结果，包含删除的记录数量
     */
    async clearAllActivities() {
        try {
            // 先获取总记录数
            const countResult = await this.db.get('SELECT COUNT(*) as count FROM activities');
            const count = countResult.count;

            // 删除所有记录
            const result = await this.db.run('DELETE FROM activities');

            logger.info(`清空活动记录成功，共删除 ${count} 条记录`);

            return {
                success: true,
                count
            };
        } catch (error) {
            logger.error('清空活动记录失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 格式化时间戳为相对时间描述
     * @param {number} timestamp - 时间戳
     * @returns {string} - 相对时间描述，如"10分钟前"、"1小时前"等
     */
    formatRelativeTime(timestamp) {
        if (!timestamp) return '';

        const now = Date.now();
        const diffMs = now - timestamp;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return '刚刚';
        } else if (diffMin < 60) {
            return `${diffMin}分钟前`;
        } else if (diffHour < 24) {
            return `${diffHour}小时前`;
        } else if (diffDay < 30) {
            return `${diffDay}天前`;
        } else {
            // 超过30天则显示具体日期
            const date = new Date(timestamp);
            return date.toLocaleDateString('zh-CN');
        }
    }

    // 关闭数据库连接
    async close() {
        if (this.db) {
            await this.db.close();
            this.db = null;
            logger.info('数据库连接已关闭');
        }
    }
}

// 创建单例实例
const database = new Database();

module.exports = database;
