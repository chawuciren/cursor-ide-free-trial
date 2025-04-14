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
        
        // 测试数据接口获取是否正确
        if (userInfoResponse.success && userInfoResponse.data && userInfoResponse.data.cursor) {
            console.log('用户数据获取成功:',
                '\n账号邮箱:', userInfoResponse.data.cursor.email,
                '\n账号额度:', userInfoResponse.data.cursor.maxRequestUsage,
                '\n已使用额度:', userInfoResponse.data.cursor.numRequests
            );
            appendToConsole('用户数据获取成功');
        } else {
            console.error('用户数据获取失败或格式不正确:', userInfoResponse);
            appendToConsole('用户数据获取失败', 'error');
        }
        
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
            <div class="form-container" style="max-height: calc(100vh - 150px); overflow-y: auto; padding: 20px;">
                <h3>用户信息</h3>
                <div class="d-flex justify-content-end mb-2">
                    <button class="btn btn-outline-primary" onclick="updateLicenseInfo()">
                        <i class="bi bi-arrow-clockwise"></i> 刷新信息
                    </button>
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
                </div>`;

        // 显示用户信息和授权信息
        html += `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>编辑器登录信息</span>
                    <span class="badge bg-info" id="dataStatus"></span>
                </div>
                <div class="card-body">
                    <div class="list-group">
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">当前登录邮箱</span>
                            <span id="editorEmail" class="value" style="color: #ffffff;">${userInfo?.cursor?.email || '-'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">登录状态</span>
                            <span id="editorLoginStatus" class="value ${userInfo?.cursor?.email ? 'text-success' : 'text-danger'}" style="color: #ffffff;">
                                ${userInfo?.cursor?.email ? '已登录' : '未登录'}
                            </span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">账号额度</span>
                            <span class="value" style="color: #ffffff;">${userInfo?.cursor?.maxRequestUsage || '-'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">已使用额度</span>
                            <span class="value" style="color: #ffffff;">${userInfo?.cursor?.numRequests || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-3">
                <div class="card-header">授权信息</div>
                <div class="card-body">
                    <div class="list-group">
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">用户名</span>
                            <span class="value" style="color: #ffffff;">${userInfo?.username || '未设置'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">过期时间</span>
                            <span class="value" style="color: #ffffff;">${userInfo?.expireTime ? new Date(userInfo.expireTime).toLocaleString() : '未设置'}</span>
                        </div>
                        <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                            <span class="label" style="color: #8a8a8a;">剩余可创建账号</span>
                            <span class="value" style="color: #ffffff;">${userInfo ? userInfo.remainingAccounts : '未知'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header">最近创建的账号</div>
                <div class="card-body">
                    <div class="list-group">
                        ${userInfo?.latestAccount ? `
                            <div class="list-group-item bg-dark-subtle border-dark text-light" style="background-color: #1a1a1a !important; border-color: #404040;">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="label" style="color: #8a8a8a;">邮箱</span>
                                    <span id="latestAccountEmail" class="value" style="color: #ffffff;">${userInfo.latestAccount.email}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <span class="label" style="color: #8a8a8a;">创建时间</span>
                                    <span id="latestAccountCreatedAt" class="value" style="color: #ffffff;">${new Date(userInfo.latestAccount.createdAt).toLocaleString()}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <span class="label" style="color: #8a8a8a;">过期时间</span>
                                    <span id="latestAccountExpireTime" class="value" style="color: #ffffff;">${new Date(userInfo.latestAccount.expireTime).toLocaleString()}</span>
                                </div>
                            </div>
                        ` : `
                            <div class="list-group-item bg-dark-subtle border-dark text-light d-flex justify-content-between align-items-center" style="background-color: #1a1a1a !important; border-color: #404040;">
                                <span class="text-center w-100">暂无最近创建的账号</span>
                            </div>
                        `}
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

// 获取状态对应的样式类
function getStatusBadgeClass(status) {
    switch (status) {
        case 'VERIFIED':
            return 'bg-success';
        case 'CODE_RECEIVED':
            return 'bg-warning';
        case 'CREATED':
            return 'bg-info';
        case 'FAILED':
            return 'bg-danger';
        case 'DISABLED':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

// 获取状态对应的文本
function getStatusText(status) {
    switch (status) {
        case 'VERIFIED':
            return '已验证';
        case 'CODE_RECEIVED':
            return '已收到验证码';
        case 'CREATED':
            return '已创建';
        case 'FAILED':
            return '注册失败';
        case 'DISABLED':
            return '已禁用';
        default:
            return status;
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
    
    // 添加刷新按钮到导航标签
    const userInfoTab = document.getElementById('user-info-tab');
    if (userInfoTab && userInfoTab.parentElement) {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-sm btn-outline-secondary ms-2';
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
        refreshBtn.title = '刷新用户信息';
        refreshBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            updateLicenseInfo();
            document.getElementById('dataStatus').innerHTML = '正在刷新...';
            setTimeout(() => {
                document.getElementById('dataStatus').innerHTML = '已更新';
                setTimeout(() => {
                    document.getElementById('dataStatus').innerHTML = '';
                }, 2000);
            }, 1000);
        };
        userInfoTab.parentElement.appendChild(refreshBtn);
    }
});

// 每分钟更新一次信息
setInterval(updateLicenseInfo, 15 * 60 * 1000);

// 用户信息页面处理
document.addEventListener('DOMContentLoaded', function() {
    // 获取用户信息
    async function fetchUserInfo() {
        try {
            const response = await http.get('/api/users/info');
            if (response.success) {
                updateUserInfo(response.data);
            } else {
                console.error('获取用户信息失败:', response.error);
            }
        } catch (error) {
            console.error('获取用户信息出错:', error);
        }
    }

    // 更新用户信息显示
    function updateUserInfo(data) {
        // 更新编辑器登录信息
        const editorEmail = document.getElementById('editorEmail');
        const editorLoginStatus = document.getElementById('editorLoginStatus');
        
        if (data.cursor && data.cursor.email) {
            editorEmail.textContent = data.cursor.email;
            editorLoginStatus.textContent = '已登录';
            editorLoginStatus.className = 'text-success';
        } else {
            editorEmail.textContent = '-';
            editorLoginStatus.textContent = '未登录';
            editorLoginStatus.className = 'text-danger';
        }

        // 更新最近创建的账号列表
        const latestAccountEmail = document.getElementById('latestAccountEmail');
        const latestAccountCreatedAt = document.getElementById('latestAccountCreatedAt');
        const latestAccountExpireTime = document.getElementById('latestAccountExpireTime');
        if (data.latestAccount && data.latestAccount.email) {
            latestAccountEmail.textContent = data.latestAccount.email;
            latestAccountCreatedAt.textContent = new Date(data.latestAccount.createdAt).toLocaleString();
            latestAccountExpireTime.textContent = new Date(data.latestAccount.expireTime).toLocaleString();
        } else {
            latestAccountEmail.textContent = '-';
            latestAccountCreatedAt.textContent = '-';
            latestAccountExpireTime.textContent = '-';
        }
    }

    // 获取状态对应的样式类
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'VERIFIED':
                return 'bg-success';
            case 'CODE_RECEIVED':
                return 'bg-warning';
            case 'CREATED':
                return 'bg-info';
            case 'FAILED':
                return 'bg-danger';
            case 'DISABLED':
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    }

    // 获取状态对应的文本
    function getStatusText(status) {
        switch (status) {
            case 'VERIFIED':
                return '已验证';
            case 'CODE_RECEIVED':
                return '已收到验证码';
            case 'CREATED':
                return '已创建';
            case 'FAILED':
                return '注册失败';
            case 'DISABLED':
                return '已禁用';
            default:
                return status;
        }
    }

    // 初始加载用户信息
    fetchUserInfo();

    // 监听标签页切换事件，当切换到用户信息标签页时刷新数据
    document.getElementById('user-info-tab').addEventListener('shown.bs.tab', function (e) {
        fetchUserInfo();
    });
});
