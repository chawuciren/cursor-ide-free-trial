document.addEventListener('DOMContentLoaded', function() {
    // 添加统计卡片动画
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.1}s`;
    });

    // 添加活动项目动画
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.animationDelay = `${0.5 + index * 0.1}s`;
        item.classList.add('fade-in');
    });

    // 清空日志按钮点击事件
    const clearActivitiesBtn = document.getElementById('clear-activities-btn');
    if (clearActivitiesBtn) {
        clearActivitiesBtn.addEventListener('click', function() {
            if (confirm('确定要清空所有活动记录吗？此操作不可恢复。')) {
                clearActivities();
            }
        });
    }
});

/**
 * 清空活动记录
 */
function clearActivities() {
    // 显示加载状态
    const btn = document.getElementById('clear-activities-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> 处理中...';

    // 发送请求
    fetch('/clear-activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 显示成功消息
            showToast('success', data.message);

            // 刷新页面以更新活动列表
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            // 显示错误消息
            showToast('error', data.message || '操作失败');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    })
    .catch(error => {
        console.error('清空活动记录失败:', error);
        showToast('error', '操作失败: ' + error.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
}

/**
 * 显示提示消息
 * @param {string} type - 消息类型：'success', 'error', 'info'
 * @param {string} message - 消息内容
 */
function showToast(type, message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;

    // 设置图标
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-triangle';

    // 设置内容
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="bi bi-${icon}"></i>
        </div>
        <div class="toast-content">
            ${message}
        </div>
        <button class="toast-close">
            <i class="bi bi-x"></i>
        </button>
    `;

    // 添加到页面
    document.body.appendChild(toast);

    // 添加关闭按钮事件
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            toast.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });
    }

    // 自动关闭
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}
