document.addEventListener('DOMContentLoaded', function() {
    const generateForm = document.querySelector('.generate-account-form form');
    const generationProgress = document.getElementById('generation-progress');
    const generationResult = document.getElementById('generation-result');
    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');
    const stepItems = document.querySelectorAll('.step-item');
    const successCount = document.querySelector('.success-count');
    const failedCount = document.querySelector('.failed-count');
    const accountsList = document.querySelector('.accounts-list');
    
    if (generateForm) {
        generateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 显示进度条，隐藏表单
            generateForm.parentElement.style.display = 'none';
            generationProgress.style.display = 'block';
            
            // 获取表单数据
            const formData = new FormData(generateForm);
            const domain = formData.get('domain');
            const count = formData.get('count');
            const notes = formData.get('notes');
            
            // 更新进度状态
            progressStatus.textContent = '准备生成账号...';
            updateStepStatus(0, '处理中');
            
            // 模拟进度
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                progressFill.style.width = `${Math.min(progress, 90)}%`;
                
                if (progress >= 30 && progress < 60) {
                    progressStatus.textContent = `正在推送到Cloudflare...`;
                    updateStepStatus(0, '完成', 'success');
                    updateStepStatus(1, '处理中');
                } else if (progress >= 60 && progress < 90) {
                    progressStatus.textContent = `正在保存到数据库...`;
                    updateStepStatus(1, '完成', 'success');
                    updateStepStatus(2, '处理中');
                }
                
                if (progress >= 90) {
                    clearInterval(interval);
                }
            }, 100);
            
            // 发送生成请求
            fetch('/accounts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    domain,
                    count: parseInt(count),
                    notes
                })
            })
            .then(response => response.json())
            .then(data => {
                // 清除进度条定时器
                clearInterval(interval);
                
                if (data.success) {
                    // 完成进度条
                    progressFill.style.width = '100%';
                    progressStatus.textContent = '账号生成完成！';
                    updateStepStatus(2, '完成', 'success');
                    
                    // 显示结果
                    setTimeout(() => {
                        generationProgress.style.display = 'none';
                        generationResult.style.display = 'block';
                        
                        // 更新结果统计
                        successCount.textContent = data.accounts.length;
                        failedCount.textContent = data.failed || 0;
                        
                        // 显示生成的账号
                        accountsList.innerHTML = '';
                        data.accounts.forEach(account => {
                            const accountItem = document.createElement('div');
                            accountItem.className = 'account-item';
                            accountItem.innerHTML = `
                                <div class="account-email">
                                    <i class="bi bi-envelope"></i> ${account.email}
                                    <button class="copy-btn copy-email-btn" data-email="${account.email}" title="复制邮箱">
                                        <i class="bi bi-clipboard"></i>
                                    </button>
                                </div>
                                <div class="account-password">
                                    <div>
                                        <i class="bi bi-key"></i> 密码: 
                                        <span class="password-value">${account.password}</span>
                                    </div>
                                    <button class="copy-btn copy-password-btn" data-password="${account.password}" title="复制密码">
                                        <i class="bi bi-clipboard"></i>
                                    </button>
                                </div>
                            `;
                            accountsList.appendChild(accountItem);
                        });
                        
                        // 添加复制功能
                        addCopyFunctionality();
                    }, 500);
                } else {
                    // 显示错误
                    progressFill.style.width = '100%';
                    progressStatus.textContent = '生成失败！';
                    progressFill.style.backgroundColor = 'var(--danger-color)';
                    
                    // 更新步骤状态
                    if (data.step === 1) {
                        updateStepStatus(0, '失败', 'error');
                    } else if (data.step === 2) {
                        updateStepStatus(0, '完成', 'success');
                        updateStepStatus(1, '失败', 'error');
                    } else if (data.step === 3) {
                        updateStepStatus(0, '完成', 'success');
                        updateStepStatus(1, '完成', 'success');
                        updateStepStatus(2, '失败', 'error');
                    }
                    
                    setTimeout(() => {
                        alert(`生成账号失败：${data.error || '未知错误'}`);
                        // 显示表单，隐藏进度条
                        generateForm.parentElement.style.display = 'block';
                        generationProgress.style.display = 'none';
                        resetProgress();
                    }, 1000);
                }
            })
            .catch(error => {
                // 清除进度条定时器
                clearInterval(interval);
                
                // 显示错误
                progressFill.style.width = '100%';
                progressStatus.textContent = '生成失败！';
                progressFill.style.backgroundColor = 'var(--danger-color)';
                
                console.error('Error:', error);
                setTimeout(() => {
                    alert('生成账号失败，请重试');
                    // 显示表单，隐藏进度条
                    generateForm.parentElement.style.display = 'block';
                    generationProgress.style.display = 'none';
                    resetProgress();
                }, 1000);
            });
        });
    }
    
    // 更新步骤状态
    function updateStepStatus(index, status, className) {
        const stepItem = stepItems[index];
        const statusEl = stepItem.querySelector('.step-status');
        
        // 移除所有状态类
        stepItem.classList.remove('active', 'success', 'error');
        
        // 添加新状态类
        if (className) {
            stepItem.classList.add(className);
        } else {
            stepItem.classList.add('active');
        }
        
        // 更新状态文本
        statusEl.textContent = status;
    }
    
    // 重置进度条
    function resetProgress() {
        progressFill.style.width = '0%';
        progressFill.style.backgroundColor = '';
        progressStatus.textContent = '准备中...';
        
        // 重置步骤状态
        stepItems.forEach(item => {
            item.classList.remove('active', 'success', 'error');
            item.querySelector('.step-status').textContent = '等待中';
        });
    }
    
    // 添加复制功能
    function addCopyFunctionality() {
        // 复制邮箱
        const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
        copyEmailBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                copyToClipboard(email);
            });
        });
        
        // 复制密码
        const copyPasswordBtns = document.querySelectorAll('.copy-password-btn');
        copyPasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const password = this.getAttribute('data-password');
                copyToClipboard(password);
            });
        });
    }
    
    // 复制到剪贴板
    function copyToClipboard(text) {
        // 创建临时输入框
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        
        // 选择并复制
        input.select();
        document.execCommand('copy');
        
        // 移除临时输入框
        document.body.removeChild(input);
        
        // 显示提示
        showToast('复制成功！');
    }
    
    // 显示Toast消息
    function showToast(message) {
        // 检查是否已存在toast
        let toast = document.querySelector('.toast-message');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-message';
            document.body.appendChild(toast);
        }
        
        // 设置消息并显示
        toast.textContent = message;
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
