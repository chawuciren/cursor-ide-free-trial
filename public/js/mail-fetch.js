document.addEventListener('DOMContentLoaded', function() {
    console.log('检查新邮件页面加载完成');

    // 绑定开始检查按钮事件
    const startFetchBtn = document.getElementById('start-fetch-btn');
    if (startFetchBtn) {
        startFetchBtn.addEventListener('click', function() {
            // 隐藏开始区域，显示进度区域
            document.getElementById('start-fetch').style.display = 'none';
            document.getElementById('fetch-progress').style.display = 'block';

            // 开始拉取邮件
            startFetchingEmails();
        });
    }

    // 绑定再次检查按钮事件
    const checkAgainBtn = document.getElementById('check-again-btn');
    if (checkAgainBtn) {
        checkAgainBtn.addEventListener('click', function() {
            // 隐藏结果区域，显示进度区域
            document.getElementById('fetch-result').style.display = 'none';
            document.getElementById('fetch-progress').style.display = 'block';

            // 重置进度条
            const progressFill = document.querySelector('.progress-fill');
            const progressStatus = document.querySelector('.progress-status');
            progressFill.style.width = '0%';
            progressStatus.textContent = '准备中...';

            // 开始拉取邮件
            startFetchingEmails();
        });
    }
});

// 拉取邮件函数
function startFetchingEmails() {
    console.log('开始检查新邮件...');
    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');

    // 初始化进度条
    progressFill.style.width = '0%';
    progressStatus.textContent = '准备中...';

    // 发送开始请求
    fetch('/mail/fetch-progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        console.log('收到响应:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error('检查邮件失败: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('收到初始响应:', data);

        if (data.success) {
            console.log('邮件检查已开始，开始轮询进度');
            // 开始轮询进度
            startPolling();
        } else {
            throw new Error(data.error || '检查邮件失败');
        }
    })
    .catch(error => {
        console.error('开始检查邮件失败:', error);
        showError(error.message);
    });
}

// 开始轮询进度
function startPolling() {
    console.log('开始轮询进度...');

    // 创建轮询间隔
    const progressInterval = setInterval(fetchProgress, 1000); // 每秒轮询一次

    // 存储间隔ID，以便在需要时清除
    window.progressInterval = progressInterval;

    // 立即执行一次查询
    fetchProgress();
}

// 查询进度函数
function fetchProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');

    fetch('/mail/fetch-status')
    .then(response => {
        if (!response.ok) {
            throw new Error('获取进度失败: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('进度更新:', data.progress + '%', data.message);

        // 更新进度条
        progressFill.style.width = `${data.progress}%`;
        progressStatus.textContent = `${data.progress}% - ${data.message}`;

        // 检查是否有结果并且进度为100%
        if (data.result && data.progress === 100) {
            console.log('进度完成且有结果，停止轮询');
            clearInterval(window.progressInterval);

            // 如果成功完成，显示结果
            if (data.result.success) {
                console.log('显示成功结果');
                showFetchResult(data.result);
            } else {
                console.log('显示错误结果');
                showError(data.result.error || '检查邮件失败');
            }
        }
    })
    .catch(error => {
        console.error('获取进度失败:', error);
        // 不中断轮询，继续尝试
    });
}

// 显示错误信息
function showError(message) {
    console.error('显示错误:', message);
    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');

    // 更新进度条为错误状态
    progressFill.style.width = '100%';
    progressFill.style.backgroundColor = 'var(--danger-color)';
    progressStatus.textContent = '检查失败: ' + message;

    // 添加重试按钮
    const progressContainer = document.querySelector('.progress-container');

    // 检查是否已经添加了错误信息和重试按钮
    if (!document.querySelector('.error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = '检查邮件时出错，请检查网络连接和邮件服务器配置。';
        progressContainer.appendChild(errorDiv);
    }

    if (!document.querySelector('.retry-btn')) {
        const retryButton = document.createElement('button');
        retryButton.className = 'btn btn-primary retry-btn';
        retryButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> 重试';
        retryButton.onclick = function() {
            window.location.reload();
        };
        progressContainer.appendChild(retryButton);
    }

    // 停止轮询
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
}

// 显示检查结果
function showFetchResult(data) {
    console.log('显示检查结果:', data);

    const progressFill = document.querySelector('.progress-fill');
    const progressStatus = document.querySelector('.progress-status');
    const fetchResult = document.getElementById('fetch-result');
    const successCount = fetchResult.querySelector('.success-count');
    const accountList = fetchResult.querySelector('.account-list');

    // 更新进度为100%
    progressFill.style.width = '100%';
    progressStatus.textContent = '100% - 检查完成';

    // 更新结果数据
    const totalEmails = data.totalEmails || 0;
    successCount.textContent = totalEmails;
    console.log('总邮件数:', totalEmails);

    // 清空账号列表
    accountList.innerHTML = '';

    // 添加账号统计
    if (data.accountStats && data.accountStats.length > 0) {
        console.log('账号统计:', data.accountStats);
        data.accountStats.forEach(stat => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.innerHTML = `
                <div class="account-email">${stat.account}</div>
                <div class="account-count">${stat.count} 封邮件</div>
            `;
            accountList.appendChild(accountItem);
        });
    } else {
        console.log('没有账号统计或账号统计为空');
        if (totalEmails > 0) {
            accountList.innerHTML = '<p>获取了邮件，但没有详细的账号统计</p>';
        } else {
            accountList.innerHTML = '<p>没有获取到新邮件</p>';
        }
    }

    // 更新结果标题
    const resultHeader = fetchResult.querySelector('.result-header h2');
    if (resultHeader) {
        if (totalEmails > 0) {
            resultHeader.innerHTML = `<i class="bi bi-check-circle"></i> 邮件检查完成`;
        } else {
            resultHeader.innerHTML = `<i class="bi bi-info-circle"></i> 邮件检查完成，没有新邮件`;
        }
    }

    // 显示结果
    console.log('显示结果面板');
    document.getElementById('fetch-progress').style.display = 'none';
    fetchResult.style.display = 'block';
}
