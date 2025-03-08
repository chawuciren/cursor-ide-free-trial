
    
    /**
     * 注入指纹保护脚本
     * @private
     */
    async #applyEvaluateOverridesBackup(page, fingerprint) {





        // // 注入 deviceMemory 保护
        // await page.evaluateOnNewDocument((memory) => {
        //     try {
        //         Object.defineProperty(navigator, 'deviceMemory', {
        //             value: memory,
        //             configurable: false,
        //             enumerable: true,
        //             writable: false
        //         });
        //     } catch (e) {
        //         // 忽略错误
        //     }
        // }, fingerprint.browser.deviceMemory);


    }