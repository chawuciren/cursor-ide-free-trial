document.addEventListener('DOMContentLoaded', function() {
    // 密码显示/隐藏功能
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // 切换图标
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            } else {
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            }
        });
    }

    // 添加表单提交动画
    const form = document.querySelector('.login-form');
    const loginBtn = document.querySelector('.login-btn');

    if (form && loginBtn) {
        form.addEventListener('submit', function(e) {
            // 添加提交动画
            const btnText = loginBtn.querySelector('.btn-text');
            const btnIcon = loginBtn.querySelector('.btn-icon');

            if (btnText && btnIcon) {
                btnText.textContent = '登录中...';
                btnIcon.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
                btnIcon.querySelector('i').classList.add('spinner');
            }

            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.8';
        });
    }
});
