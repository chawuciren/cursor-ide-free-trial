// 更新标签页可见性 - 所有标签都显示
function updateTabsVisibility() {
    const tabs = document.querySelectorAll('#mainTabs .nav-item');
    tabs.forEach(tab => {
        tab.style.display = ''; // 所有标签都显示
    });
}

// 更新用户信息显示
async function updateLicenseInfo() {
    try {
        const [licenseResponse, machineCodeResponse, userInfoResponse] = await Promise.all([
            API.license.status().catch(e => {
                console.error('License status error:', e);
                return { status: {} };
            }),
            API.license.getMachineCode().catch(e => {
                console.error('Machine code error:', e);
                return { machineCode: '获取失败' };
            }),
            API.users.info().catch(e => {
                console.error('User info error:', e);
                return { success: false, error: e.message };
            })
        ]);

        // 记录每个响应以帮助调试
        console.log('License Response:', licenseResponse);
        console.log('Machine Code Response:', machineCodeResponse);
        console.log('User Info Response:', userInfoResponse);
        
        const status = licenseResponse.status;
        const machineCode = machineCodeResponse.machineCode;
        
        console.log('User Info Response:', userInfoResponse);
        if (!userInfoResponse.success) {
            console.error('获取用户信息失败:', userInfoResponse.error);
            appendToConsole('获取用户信息失败: ' + userInfoResponse.error, 'error');
        }
        
        const userInfo = userInfoResponse.success ? userInfoResponse.data : null;

        // 更新标签页可见性
        updateTabsVisibility();

        const userInfoContent = document.getElementById('user-info');
        let html = `
            <div class="form-container">
                <h3>用户信息</h3>
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">机器码</label>
                            <div class="input-group">
                                <input type="text" class="form-control bg-dark text-light border-secondary" id="machineCodeDisplay" value="${machineCode}" readonly>
                                <button class="btn btn-outline-secondary" type="button" onclick="copyMachineCode()">
                                    <i class="bi bi-clipboard"></i> 复制
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;

        // 显示用户信息和授权信息
        const info = status.licenseInfo || {};
        html += `
            <div class="card">
                <div class="card-body">
                    <div class="list-group">
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">用户名</span>
                            <span class="value" style="color: #ffffff;">${info.username || '未设置'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">授权类型</span>
                            <span class="value" style="color: #ffffff;">${info.type || '未知'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">过期时间</span>
                            <span class="value" style="color: #ffffff;">${info.expiryDate ? new Date(info.expiryDate).toLocaleString() : '未设置'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">剩余可创建账号</span>
                            <span class="value" style="color: #ffffff;">${userInfo ? userInfo.remainingAccounts : '未知'}</span>
                        </div>
                        ${userInfo && userInfo.latestAccount ? `
                        <div class="list-group-item bg-dark-subtle border-dark text-light" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="label" style="color: #8a8a8a;">最近创建的账号</span>
                            </div>
                            <div class="mt-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="label" style="color: #8a8a8a;">邮箱</span>
                                    <span class="value" style="color: #ffffff;">${userInfo.latestAccount.email}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-1">
                                    <span class="label" style="color: #8a8a8a;">创建时间</span>
                                    <span class="value" style="color: #ffffff;">${new Date(userInfo.latestAccount.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>`;
        userInfoContent.innerHTML = html;
    } catch (error) {
        console.error('获取信息失败:', error);
        const machineCode = await API.license.getMachineCode().then(res => res.machineCode).catch(() => '获取失败');
        const userInfoContent = document.getElementById('user-info');
        userInfoContent.innerHTML = `
            <div class="form-container">
                <h3>用户信息</h3>
                <div class="alert alert-danger">
                    获取信息失败: ${error.message}
                </div>
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">机器码</label>
                            <div class="input-group">
                                <input type="text" class="form-control bg-dark text-light border-secondary" id="machineCodeDisplay" value="${machineCode}" readonly>
                                <button class="btn btn-outline-secondary" type="button" onclick="copyMachineCode()">
                                    <i class="bi bi-clipboard"></i> 复制
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <div class="list-group">
                            <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                                <span class="label" style="color: #8a8a8a;">剩余可创建账号</span>
                                <span class="value" style="color: #ffffff;">未知</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

// 复制机器码到剪贴板
function copyMachineCode() {
    const machineCodeInput = document.getElementById('machineCodeDisplay');
    machineCodeInput.select();
    document.execCommand('copy');
    appendToConsole('success', '机器码已复制到剪贴板');
}

// 页面加载完成后更新信息
document.addEventListener('DOMContentLoaded', () => {
    updateLicenseInfo();
});

// 每分钟更新一次信息
setInterval(updateLicenseInfo, 60000);
