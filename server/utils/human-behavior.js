const logger = require('./logger');
const delay = require('./delay');
const FingerprintSimulator = require('./fingerprint-simulator');

class HumanBehavior {
    constructor() {
        this.minDelay = 500;
        this.maxDelay = 2000;
        this.typeMinDelay = 50;
        this.typeMaxDelay = 200;
        this.fingerprintSimulator = new FingerprintSimulator();
    }

    // Private helper methods
    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #getRandomPoint(maxX, maxY) {
        return {
            x: this.#getRandomInt(0, maxX),
            y: this.#getRandomInt(0, maxY)
        };
    }

    /**
     * 模拟人类行为
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     * @param {Object} options 配置选项
     * @param {number} options.duration 模拟行为持续时间（毫秒），默认5000ms
     * @param {number} options.movements 鼠标移动次数，默认3-7次
     */
    async simulateHumanBehavior(page, options = {}) {
        const duration = options.duration || 5000;
        const movements = this.#getRandomInt(3, options.movements || 7);

        try {
            const dimensions = await page.evaluate(() => ({
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            }));

            logger.info(`开始模拟人类行为，计划移动 ${movements} 次`);

            for (let i = 0; i < movements; i++) {
                const point = this.#getRandomPoint(dimensions.width, dimensions.height);
                await page.mouse.move(point.x, point.y);
                logger.debug(`鼠标移动到位置: (${point.x}, ${point.y})`);

                const waitTime = this.#getRandomInt(this.minDelay, this.maxDelay);
                await delay(waitTime);

                if (Math.random() < 0.25) {
                    const scrollY = this.#getRandomInt(-300, 300);
                    await page.evaluate((y) => window.scrollBy(0, y), scrollY);
                    logger.debug(`页面滚动: ${scrollY}px`);
                }
            }

            await delay(this.#getRandomInt(this.minDelay, this.maxDelay));
            logger.info('人类行为模拟完成');
        } catch (error) {
            logger.error('模拟人类行为时出错:', error);
            throw error;
        }
    }

    /**
     * 模拟人类输入文本
     * @param {import('puppeteer').Page} page Puppeteer页面实例
     * @param {string} selector 输入框选择器
     * @param {string} text 要输入的文本
     */
    async simulateHumanTyping(page, selector, text) {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
            await delay(this.#getRandomInt(300, 800));

            for (const char of text.split('')) {
                await page.type(selector, char, {
                    delay: this.#getRandomInt(this.typeMinDelay, this.typeMaxDelay)
                });

                if (Math.random() < 0.1) {
                    await delay(this.#getRandomInt(400, 1000));
                }
            }

            await delay(this.#getRandomInt(200, 500));
            logger.debug(`已模拟人工输入文本到 ${selector}`);
        } catch (error) {
            logger.error('模拟人类输入文本时出错:', error);
            throw error;
        }
    }
}

module.exports = HumanBehavior;
