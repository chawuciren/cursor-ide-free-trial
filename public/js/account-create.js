document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const domainSelect = document.getElementById('domain');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password-btn');
    const generatePasswordBtn = document.querySelector('.generate-password-btn');
    const generateUsernameBtn = document.querySelector('.generate-username-btn');
    const emailPreview = document.getElementById('email-preview-text');
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.create-btn');

    // 更新邮箱预览
    function updateEmailPreview() {
        const username = usernameInput.value.trim() || 'username';
        const domain = domainSelect.value || '@domain.com';
        emailPreview.textContent = username + domain;

        // 添加高亮效果
        emailPreview.classList.add('highlight');
        setTimeout(() => {
            emailPreview.classList.remove('highlight');
        }, 300);
    }

    // 验证用户名格式
    function validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        return usernameRegex.test(username);
    }

    // 显示错误信息
    function showError(element, message) {
        // 移除之前的错误信息
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 创建错误信息元素
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        // 添加到DOM
        element.parentElement.appendChild(errorElement);

        // 添加错误样式
        element.classList.add('is-invalid');
    }

    // 清除错误信息
    function clearError(element) {
        const errorElement = element.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        element.classList.remove('is-invalid');
    }

    // 实时验证用户名
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();

        // 更新邮箱预览
        updateEmailPreview();

        // 如果用户名为空，不显示错误
        if (!username) {
            clearError(this);
            return;
        }

        // 验证用户名格式
        if (!validateUsername(username)) {
            showError(this, '用户名只能包含字母、数字、下划线和连字符');
        } else {
            clearError(this);
        }
    });

    // 域名选择变化时更新预览
    domainSelect.addEventListener('change', function() {
        updateEmailPreview();

        if (!this.value) {
            showError(this, '请选择域名');
        } else {
            clearError(this);
        }
    });

    // 表单提交验证
    form.addEventListener('submit', function(event) {
        let isValid = true;
        const username = usernameInput.value.trim();
        const domain = domainSelect.value;

        // 验证用户名
        if (!username) {
            showError(usernameInput, '请输入用户名');
            isValid = false;
        } else if (!validateUsername(username)) {
            showError(usernameInput, '用户名只能包含字母、数字、下划线和连字符');
            isValid = false;
        } else {
            clearError(usernameInput);
        }

        // 验证域名
        if (!domain) {
            showError(domainSelect, '请选择域名');
            isValid = false;
        } else {
            clearError(domainSelect);
        }

        // 如果验证不通过，阻止表单提交
        if (!isValid) {
            event.preventDefault();

            // 滚动到第一个错误元素
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // 显示加载状态
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> 创建中...';
        }
    });

    // 重置按钮点击事件
    document.querySelector('button[type="reset"]').addEventListener('click', function() {
        // 清除所有错误信息
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // 重置邮箱预览
        setTimeout(updateEmailPreview, 10);
    });

    // 密码显示/隐藏功能
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.innerHTML = '<i class="bi bi-eye-slash"></i>';
            this.setAttribute('title', '隐藏密码');
        } else {
            passwordInput.type = 'password';
            this.innerHTML = '<i class="bi bi-eye"></i>';
            this.setAttribute('title', '显示密码');
        }
    });

    // 生成随机用户名
    if (generateUsernameBtn) {
        console.log('用户名生成按钮已找到');
        generateUsernameBtn.addEventListener('click', function() {
            console.log('用户名生成按钮被点击');
            // 生成随机用户名
            const username = generateRandomUsername();
            usernameInput.value = username;

            // 更新邮箱预览
            updateEmailPreview();

            // 添加高亮效果
            usernameInput.classList.add('highlight');
            setTimeout(() => {
                usernameInput.classList.remove('highlight');
            }, 300);

            // 清除可能的错误
            clearError(usernameInput);
        });
    } else {
        console.error('未找到用户名生成按钮');
    }

    // 生成随机密码
    if (generatePasswordBtn) {
        console.log('密码生成按钮已找到');
        generatePasswordBtn.addEventListener('click', function() {
            console.log('密码生成按钮被点击');
            // 生成随机密码
            const password = generateRandomPassword();
            passwordInput.value = password;

            // 显示密码
            passwordInput.type = 'text';
            togglePasswordBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
            togglePasswordBtn.setAttribute('title', '隐藏密码');

            // 添加高亮效果
            passwordInput.classList.add('highlight');
            setTimeout(() => {
                passwordInput.classList.remove('highlight');
            }, 300);
        });
    } else {
        console.error('未找到密码生成按钮');
    }

    // 生成随机用户名函数
    function generateRandomUsername() {
        // 随机决定生成模式
        const patterns = [
            ['word', 'number'],
            ['word', 'word', 'number'],
            ['word', 'number', 'word']
        ];

        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        const parts = [];

        // 词库
        const adjectives = [
            'swift', 'smart', 'cyber', 'digital', 'quantum', 'binary', 'crypto', 'tech', 'pixel', 'data',
            'neural', 'cloud', 'mobile', 'robot', 'atomic', 'vector', 'matrix', 'laser', 'sonic', 'nano',
            'clever', 'bright', 'quick', 'wise', 'sharp', 'keen', 'agile', 'rapid', 'fast', 'skilled',
            'happy', 'cool', 'epic', 'super', 'mega', 'ultra', 'hyper', 'prime', 'elite', 'pro'
        ];

        const nouns = [
            'coder', 'dev', 'hacker', 'ninja', 'wizard', 'guru', 'master', 'pro', 'expert', 'ace',
            'tech', 'byte', 'bit', 'data', 'code', 'algo', 'sys', 'net', 'web', 'app',
            'cloud', 'cyber', 'crypto', 'quantum', 'mobile', 'robot', 'ai', 'ml', 'db', 'api'
        ];

        // 根据模式生成用户名
        selectedPattern.forEach(type => {
            if (type === 'number') {
                // 生成随机数字
                parts.push(Math.floor(Math.random() * 9999).toString());
            } else {
                // 生成随机词
                const words = Math.random() < 0.5 ? adjectives : nouns;
                parts.push(words[Math.floor(Math.random() * words.length)]);
            }
        });

        return parts.join('');
    }

    // 生成随机密码函数
    function generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    // 初始化预览
    updateEmailPreview();

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            color: var(--danger-color);
            font-size: 0.85rem;
            margin-top: 0.5rem;
            animation: fadeIn 0.3s ease;
        }

        .is-invalid {
            border-color: var(--danger-color) !important;
        }

        .highlight {
            background-color: rgba(71, 118, 230, 0.2);
            transition: background-color 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
