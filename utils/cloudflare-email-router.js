const axios = require('axios');
const logger = require('./logger');
const StringHelper = require('./string-helper');

class CloudflareEmailManager {
    constructor(config) {
        this.config = config;
        this.cloudflareConfigs = config.cloudflare;
    }

    async registerEmailAccount(account) {
        try {
            logger.info('开始注册 Cloudflare 邮箱账号...');

            // 从账号邮箱中提取域名
            const emailDomain = account.email.substring(account.email.indexOf('@'));

            // 查找对应的 Cloudflare 配置
            const cloudflareConfig = this.cloudflareConfigs.find(c => c.domain === emailDomain);
            if (!cloudflareConfig) {
                throw new Error(`未找到域名 ${emailDomain} 的配置`);
            }

            const requestBody = {
                name: `Forward ${account.email}`,
                enabled: true,
                matchers: [
                    {
                        type: "literal",
                        field: "to",
                        value: account.email
                    }
                ],
                actions: [
                    {
                        type: "forward",
                        value: [cloudflareConfig.emailForward]
                    }
                ]
            };

            logger.info('Cloudflare API 请求数据:', JSON.stringify(requestBody, null, 2));

            const response = await axios.post(
                `https://api.cloudflare.com/client/v4/zones/${cloudflareConfig.zoneId}/email/routing/rules`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data.success) {
                logger.error('Cloudflare API 响应错误:', {
                    errors: response.data.errors,
                    messages: response.data.messages
                });
                throw new Error('Cloudflare API 调用失败: ' + JSON.stringify(response.data.errors));
            }

            logger.info('Cloudflare 邮箱账号注册成功');
            return response.data;

        } catch (error) {
            if (error.response) {
                logger.error('Cloudflare API 错误响应:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    }

    /**
     * 创建邮件路由规则
     * @param {string} email - 邮箱地址
     * @returns {Promise<{success: boolean, ruleId?: string, error?: string}>} - 操作结果
     */
    async createEmailRoute(email) {
        try {
            logger.info(`开始创建邮件路由规则: ${email}`);

            // 从邮箱中提取域名
            const emailDomain = email.substring(email.indexOf('@'));

            // 查找对应的 Cloudflare 配置
            const cloudflareConfig = this.cloudflareConfigs.find(c => c.domain === emailDomain);
            if (!cloudflareConfig) {
                return {
                    success: false,
                    error: `未找到域名 ${emailDomain} 的配置`
                };
            }

            const requestBody = {
                name: `Forward ${email}`,
                enabled: true,
                matchers: [
                    {
                        type: "literal",
                        field: "to",
                        value: email
                    }
                ],
                actions: [
                    {
                        type: "forward",
                        value: [cloudflareConfig.emailForward]
                    }
                ]
            };

            logger.info('Cloudflare API 请求数据:', JSON.stringify(requestBody, null, 2));

            const response = await axios.post(
                `https://api.cloudflare.com/client/v4/zones/${cloudflareConfig.zoneId}/email/routing/rules`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data.success) {
                logger.error('Cloudflare API 响应错误:', {
                    errors: response.data.errors,
                    messages: response.data.messages
                });
                return {
                    success: false,
                    error: response.data.errors?.[0]?.message || '创建邮件路由规则失败'
                };
            }

            logger.info(`邮件路由规则创建成功: ${email}`);
            return {
                success: true,
                ruleId: response.data.result.id
            };

        } catch (error) {
            logger.error(`创建邮件路由规则失败: ${email}`, error);
            return {
                success: false,
                error: error.message || '创建邮件路由规则失败'
            };
        }
    }

    // 删除指定域名下的路由规则
    async removeEmailRoute(ruleId, emailDomain) {
        try {
            logger.info('开始删除 Cloudflare 邮件路由规则...', { ruleId, emailDomain });

            // 查找对应域名的配置
            const cloudflareConfig = this.cloudflareConfigs.find(c => c.domain === emailDomain);
            if (!cloudflareConfig) {
                throw new Error(`未找到域名 ${emailDomain} 的配置`);
            }

            const response = await axios.delete(
                `https://api.cloudflare.com/client/v4/zones/${cloudflareConfig.zoneId}/email/routing/rules/${ruleId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                logger.info('Cloudflare 邮件路由规则删除成功', { ruleId, emailDomain });
                return true;
            } else {
                throw new Error(response.data.errors?.[0]?.message || '删除邮件路由规则失败');
            }
        } catch (error) {
            logger.error('删除 Cloudflare 邮件路由规则失败:', {
                error: error.message,
                ruleId,
                emailDomain
            });
            throw error;
        }
    }

    /**
     * 列出所有域名下的路由规则，支持分页获取所有数据
     * @returns {Promise<Array>} - 所有路由规则列表
     */
    async listEmailRoutes() {
        try {
            logger.info('获取所有域名的 Cloudflare 邮件路由规则列表...');

            const allRules = [];

            // 遍历所有域名配置，获取各自的路由规则
            for (const cloudflareConfig of this.cloudflareConfigs) {
                try {
                    // 初始化分页参数
                    let page = 1;
                    let hasMorePages = true;
                    const perPage = 50; // 每页获取50条记录，这是Cloudflare API的最大值

                    logger.info(`开始获取域名 ${cloudflareConfig.domain} 的邮件路由规则...`);

                    // 循环获取所有页的数据
                    while (hasMorePages) {
                        logger.info(`获取域名 ${cloudflareConfig.domain} 的邮件路由规则，页码: ${page}, 每页数量: ${perPage}`);

                        const response = await axios.get(
                            `https://api.cloudflare.com/client/v4/zones/${cloudflareConfig.zoneId}/email/routing/rules`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
                                    'Content-Type': 'application/json'
                                },
                                params: {
                                    page: page,
                                    per_page: perPage
                                }
                            }
                        );

                        if (response.data.success) {
                            // 为每条规则添加域名信息
                            const rules = response.data.result.map(rule => ({
                                ...rule,
                                domain: cloudflareConfig.domain
                            }));

                            allRules.push(...rules);

                            // 检查是否有更多页
                            if (response.data.result_info) {
                                const { total_count, count, per_page, page: currentPage } = response.data.result_info;

                                logger.info(`域名 ${cloudflareConfig.domain} 的邮件路由规则分页信息:`, {
                                    page: currentPage,
                                    perPage: per_page,
                                    count: count,
                                    totalCount: total_count
                                });

                                // 如果当前页的记录数小于每页数量，或者已经获取了所有记录，则不再获取下一页
                                if (count < per_page || (currentPage * per_page) >= total_count) {
                                    hasMorePages = false;
                                    logger.info(`域名 ${cloudflareConfig.domain} 的邮件路由规则已全部获取，共 ${total_count} 条`);
                                } else {
                                    page++;
                                }
                            } else {
                                // 如果没有分页信息，则假设已经获取了所有数据
                                hasMorePages = false;
                                logger.info(`域名 ${cloudflareConfig.domain} 的邮件路由规则已获取，但无分页信息`);
                            }
                        } else {
                            logger.warn(`获取域名 ${cloudflareConfig.domain} 的路由规则失败:`, response.data.errors);
                            hasMorePages = false; // 出错时停止获取
                        }
                    }
                } catch (error) {
                    logger.error(`获取域名 ${cloudflareConfig.domain} 的路由规则出错:`, error);
                    // 继续处理其他域名，不中断整个流程
                }
            }

            logger.info('成功获取所有邮件路由规则列表', {
                totalRules: allRules.length,
                domainCount: this.cloudflareConfigs.length
            });

            return allRules;

        } catch (error) {
            logger.error('获取邮件路由规则列表失败:', {
                error: error.message
            });
            throw error;
        }
    }

    // 获取所有可用的虚拟域名列表
    getVirtualDomains() {
        return this.cloudflareConfigs.map(c => c.domain);
    }

    /**
     * 更新邮件路由规则的启用状态
     * @param {string} email - 邮箱地址
     * @param {boolean} enabled - 是否启用
     * @returns {Promise<{success: boolean, error?: string}>} - 操作结果
     */
    async updateEmailRouteStatus(email, enabled) {
        try {
            logger.info(`开始更新邮件路由规则状态: ${email}, 启用状态: ${enabled}`);

            // 从邮箱中提取域名
            const emailDomain = email.substring(email.indexOf('@'));

            // 查找对应的 Cloudflare 配置
            const cloudflareConfig = this.cloudflareConfigs.find(c => c.domain === emailDomain);
            if (!cloudflareConfig) {
                return {
                    success: false,
                    error: `未找到域名 ${emailDomain} 的配置`
                };
            }

            // 获取所有路由规则
            const emailRoutes = await this.listEmailRoutes();

            // 查找对应的路由规则
            const emailRoute = emailRoutes.find(route =>
                route.matchers.some(matcher =>
                    matcher.type === 'literal' &&
                    matcher.field === 'to' &&
                    matcher.value === email
                )
            );

            if (!emailRoute) {
                return {
                    success: false,
                    error: `未找到邮箱 ${email} 的路由规则`
                };
            }

            // 如果状态已经是目标状态，则不需要更新
            if (emailRoute.enabled === enabled) {
                logger.info(`邮件路由规则 ${email} 的状态已经是 ${enabled ? '启用' : '禁用'}`);
                return {
                    success: true,
                    message: `邮件路由规则状态已经是 ${enabled ? '启用' : '禁用'}`
                };
            }

            // 准备更新请求
            const requestBody = {
                ...emailRoute,
                enabled: enabled
            };

            // 删除domain字段，因为这是我们自己添加的，不是API需要的
            delete requestBody.domain;

            logger.info('Cloudflare API 请求数据:', JSON.stringify(requestBody, null, 2));

            // 发送更新请求
            const response = await axios.put(
                `https://api.cloudflare.com/client/v4/zones/${cloudflareConfig.zoneId}/email/routing/rules/${emailRoute.id}`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${cloudflareConfig.apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data.success) {
                logger.error('Cloudflare API 响应错误:', {
                    errors: response.data.errors,
                    messages: response.data.messages
                });
                return {
                    success: false,
                    error: response.data.errors?.[0]?.message || '更新邮件路由规则状态失败'
                };
            }

            logger.info(`邮件路由规则状态更新成功: ${email}, 新状态: ${enabled ? '启用' : '禁用'}`);
            return {
                success: true,
                message: `邮件路由规则状态已更新为 ${enabled ? '启用' : '禁用'}`
            };

        } catch (error) {
            logger.error(`更新邮件路由规则状态失败: ${email}`, error);
            return {
                success: false,
                error: error.message || '更新邮件路由规则状态失败'
            };
        }
    }
}

module.exports = CloudflareEmailManager;