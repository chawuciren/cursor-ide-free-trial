document.addEventListener('DOMContentLoaded', function() {
    // 复制功能
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
    
    // 复制邮箱
    const copyEmailBtn = document.querySelector('.copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            copyToClipboard(email);
        });
    }
    
    // 复制密码
    const copyPasswordBtn = document.querySelector('.copy-password-btn');
    if (copyPasswordBtn) {
        copyPasswordBtn.addEventListener('click', function() {
            const password = this.getAttribute('data-password');
            if (password && password.trim() !== '') {
                copyToClipboard(password);
            } else {
                showToast('没有可用的密码，请先重置密码');
            }
        });
    }
    
    // 显示密码
    const showPasswordBtn = document.querySelector('.show-password-btn');
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function() {
            const password = this.getAttribute('data-password');
            const passwordValue = document.querySelector('.password-value');
            
            if (password && password.trim() !== '') {
                if (this.classList.contains('showing')) {
                    // 隐藏密码
                    passwordValue.textContent = '••••••••••••';
                    this.innerHTML = '<i class="bi bi-eye"></i> 显示';
                    this.classList.remove('showing');
                } else {
                    // 显示密码
                    passwordValue.textContent = password;
                    this.innerHTML = '<i class="bi bi-eye-slash"></i> 隐藏';
                    this.classList.add('showing');
                }
            } else {
                showToast('没有可用的密码，请先重置密码');
            }
        });
    }
    
    // 重置密码功能
    const resetPasswordModal = document.getElementById('reset-password-modal');
    const resetPasswordButtons = document.querySelectorAll('.reset-password-btn');
    const resetPasswordModalCancelBtn = resetPasswordModal.querySelector('.cancel-btn');
    const confirmResetBtn = resetPasswordModal.querySelector('.confirm-reset-btn');
    const resetPasswordModalCloseBtn = resetPasswordModal.querySelector('.close-btn');
    const resetPasswordDoneBtn = resetPasswordModal.querySelector('.done-btn');
    const resetPasswordResult = document.getElementById('reset-password-result');
    const newPasswordInput = document.getElementById('new-password');
    const copyNewPasswordBtn = resetPasswordModal.querySelector('.copy-new-password-btn');
    
    let currentResetAccountId = null;
    
    resetPasswordButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentResetAccountId = this.getAttribute('data-id');
            
            // 重置模态框状态
            resetPasswordResult.style.display = 'none';
            confirmResetBtn.style.display = '';
            resetPasswordModalCancelBtn.style.display = '';
            resetPasswordDoneBtn.style.display = 'none';
            
            resetPasswordModal.classList.add('show');
        });
    });
    
    function closeResetPasswordModal() {
        resetPasswordModal.classList.remove('show');
        currentResetAccountId = null;
    }
    
    resetPasswordModalCancelBtn.addEventListener('click', closeResetPasswordModal);
    resetPasswordModalCloseBtn.addEventListener('click', closeResetPasswordModal);
    resetPasswordDoneBtn.addEventListener('click', function() {
        window.location.reload();
    });
    
    confirmResetBtn.addEventListener('click', function() {
        if (currentResetAccountId) {
            // 发送重置密码请求
            fetch(`/accounts/reset-password/${currentResetAccountId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 显示新密码
                    newPasswordInput.value = data.password;
                    resetPasswordResult.style.display = 'block';
                    confirmResetBtn.style.display = 'none';
                    resetPasswordModalCancelBtn.style.display = 'none';
                    resetPasswordDoneBtn.style.display = '';
                } else {
                    alert(`重置密码失败: ${data.error || '未知错误'}`);
                    closeResetPasswordModal();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('重置密码失败，请重试');
                closeResetPasswordModal();
            });
        }
    });
    
    // 复制新密码
    copyNewPasswordBtn.addEventListener('click', function() {
        copyToClipboard(newPasswordInput.value);
    });
    
    // 删除功能
    const deleteModal = document.getElementById('delete-modal');
    const deleteButton = document.querySelector('.delete-btn');
    const deleteModalCancelBtn = deleteModal.querySelector('.cancel-btn');
    const confirmDeleteBtn = deleteModal.querySelector('.confirm-delete-btn');
    const deleteModalCloseBtn = deleteModal.querySelector('.close-btn');
    
    let currentAccountId = null;
    
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            currentAccountId = this.getAttribute('data-id');
            deleteModal.classList.add('show');
        });
    }
    
    function closeDeleteModal() {
        deleteModal.classList.remove('show');
        currentAccountId = null;
    }
    
    deleteModalCancelBtn.addEventListener('click', closeDeleteModal);
    deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
    
    confirmDeleteBtn.addEventListener('click', function() {
        if (currentAccountId) {
            // 发送删除请求
            fetch(`/accounts/delete/${currentAccountId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 删除成功，跳转到账号列表页
                    window.location.href = '/accounts';
                } else {
                    alert('删除失败，请重试');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('删除失败，请重试');
            })
            .finally(() => {
                closeDeleteModal();
            });
        }
    });
});
