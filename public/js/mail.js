document.addEventListener('DOMContentLoaded', function() {
    console.log('邮件列表页面加载完成');

    // 邮件列表页筛选功能
    const accountFilter = document.getElementById('account-filter');
    const statusFilter = document.getElementById('status-filter');
    const senderFilter = document.getElementById('sender-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const hasAttachmentsFilter = document.getElementById('has-attachments');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    // 检查新邮件按钮
    const checkMailBtn = document.getElementById('check-mail-btn');
    if (checkMailBtn) {
        console.log('找到检查新邮件按钮');
        checkMailBtn.addEventListener('click', function(e) {
            console.log('检查新邮件按钮被点击');
            // 不阻止默认行为，让链接正常跳转
        });
    }

    // 空状态下检查新邮件按钮
    const checkMailBtnEmpty = document.getElementById('check-mail-btn-empty');
    if (checkMailBtnEmpty) {
        console.log('找到空状态下的检查新邮件按钮');
        checkMailBtnEmpty.addEventListener('click', function(e) {
            console.log('空状态下的检查新邮件按钮被点击');
            // 不阻止默认行为，让链接正常跳转
        });
    }

    // 表单方式检查按钮
    const checkMailFormBtn = document.getElementById('check-mail-form-btn');
    if (checkMailFormBtn) {
        console.log('找到表单方式检查按钮');
        checkMailFormBtn.addEventListener('click', function(e) {
            console.log('表单方式检查按钮被点击');
            // 不阻止默认行为，让链接正常跳转
        });
    }

    // 空状态下表单方式检查按钮
    const checkMailFormBtnEmpty = document.getElementById('check-mail-form-btn-empty');
    if (checkMailFormBtnEmpty) {
        console.log('找到空状态下的表单方式检查按钮');
        checkMailFormBtnEmpty.addEventListener('click', function(e) {
            console.log('空状态下的表单方式检查按钮被点击');
            // 不阻止默认行为，让链接正常跳转
        });
    }

    // 全部设为已读按钮和模态框
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    const markReadModal = document.getElementById('mark-read-modal');
    const markReadModalCancelBtn = markReadModal ? markReadModal.querySelector('.cancel-btn') : null;
    const confirmMarkReadBtn = markReadModal ? markReadModal.querySelector('.confirm-mark-read-btn') : null;
    const markReadModalCloseBtn = markReadModal ? markReadModal.querySelector('.close-btn') : null;

    let currentFilters = {};

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

    // 关闭模态框
    function closeMarkReadModal() {
        if (markReadModal) {
            markReadModal.classList.remove('show');
        }
    }

    if (markAllReadBtn && markReadModal) {
        console.log('找到全部设为已读按钮和模态框');

        // 点击按钮显示模态框
        markAllReadBtn.addEventListener('click', function(e) {
            console.log('全部设为已读按钮被点击');

            // 获取当前筛选条件
            const filterForm = document.getElementById('filter-form');
            currentFilters = {};

            if (filterForm) {
                try {
                    const formData = new FormData(filterForm);

                    // 将表单数据转换为对象
                    for (const [key, value] of formData.entries()) {
                        currentFilters[key] = value;
                    }

                    console.log('筛选条件:', currentFilters);
                } catch (error) {
                    console.error('获取表单数据失败:', error);
                    // 使用URL参数作为备选方案
                    const urlParams = new URLSearchParams(window.location.search);
                    for (const [key, value] of urlParams.entries()) {
                        currentFilters[key] = value;
                    }
                    console.log('从URL获取的筛选条件:', currentFilters);
                }
            } else {
                console.warn('未找到筛选表单，使用URL参数');
                // 使用URL参数作为备选方案
                const urlParams = new URLSearchParams(window.location.search);
                for (const [key, value] of urlParams.entries()) {
                    currentFilters[key] = value;
                }
                console.log('从URL获取的筛选条件:', currentFilters);
            }

            // 显示模态框
            markReadModal.classList.add('show');
        });

        // 取消按钮关闭模态框
        if (markReadModalCancelBtn) {
            markReadModalCancelBtn.addEventListener('click', closeMarkReadModal);
        }

        // 关闭按钮关闭模态框
        if (markReadModalCloseBtn) {
            markReadModalCloseBtn.addEventListener('click', closeMarkReadModal);
        }

        // 确认按钮执行标记已读操作
        if (confirmMarkReadBtn) {
            confirmMarkReadBtn.addEventListener('click', function() {
                // 禁用按钮，防止重复点击
                confirmMarkReadBtn.disabled = true;
                confirmMarkReadBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> 处理中...';

                // 发送请求
                console.log('发送标记已读请求，数据:', JSON.stringify(currentFilters));
                fetch('/mail/mark-all-as-read', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(currentFilters)
                })
                .then(response => {
                    console.log('响应状态:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('标记已读响应:', data);

                    if (data.success) {
                        // 关闭模态框
                        closeMarkReadModal();

                        // 显示成功消息
                        showToast(`成功将 ${data.count} 封邮件标记为已读`);

                        // 刷新页面
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        // 显示错误消息
                        showToast('标记邮件为已读失败: ' + (data.message || '未知错误'));

                        // 恢复按钮状态
                        confirmMarkReadBtn.disabled = false;
                        confirmMarkReadBtn.innerHTML = '确认';

                        // 关闭模态框
                        setTimeout(closeMarkReadModal, 1500);
                    }
                })
                .catch(error => {
                    console.error('标记已读请求失败:', error);
                    showToast('标记邮件为已读请求失败，请稍后重试');

                    // 恢复按钮状态
                    confirmMarkReadBtn.disabled = false;
                    confirmMarkReadBtn.innerHTML = '确认';

                    // 关闭模态框
                    setTimeout(closeMarkReadModal, 1500);
                });
            });
        }
    } else {
        console.warn('未找到全部设为已读按钮或模态框');
    }

    // 处理每页显示数量的变化
    const pageSizeSelect = document.getElementById('page-size-select');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            // 获取当前URL
            const url = new URL(window.location.href);
            // 设置新的pageSize参数
            url.searchParams.set('pageSize', this.value);
            // 重置页码为1
            url.searchParams.set('page', '1');
            // 跳转到新URL
            window.location.href = url.toString();
        });
    }

    // 添加隐藏的页码和每页显示数量输入框，用于表单提交
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        // 检查是否已经存在这些输入框
        if (!document.getElementById('page-input')) {
            const pageInput = document.createElement('input');
            pageInput.type = 'hidden';
            pageInput.id = 'page-input';
            pageInput.name = 'page';
            pageInput.value = document.querySelector('[data-current-page]')?.getAttribute('data-current-page') || '1';
            filterForm.appendChild(pageInput);
        }

        if (!document.getElementById('page-size-input')) {
            const pageSizeInput = document.createElement('input');
            pageSizeInput.type = 'hidden';
            pageSizeInput.id = 'page-size-input';
            pageSizeInput.name = 'pageSize';
            pageSizeInput.value = document.querySelector('[data-page-size]')?.getAttribute('data-page-size') || '10';
            filterForm.appendChild(pageSizeInput);
        }

        // 提交表单时重置页码为1
        filterForm.addEventListener('submit', function() {
            document.getElementById('page-input').value = '1';
        });
    }

    // 检查是否在邮件列表页面
    if (accountFilter && statusFilter) {
        const emailRows = document.querySelectorAll('.email-row');

        function applyFilters() {
            const accountValue = accountFilter.value.toLowerCase();
            const statusValue = statusFilter.value;
            const senderValue = senderFilter ? senderFilter.value.toLowerCase() : '';
            const subjectValue = subjectFilter ? subjectFilter.value.toLowerCase() : '';
            const hasAttachmentsValue = hasAttachmentsFilter ? hasAttachmentsFilter.value : 'all';
            const startDate = startDateInput ? new Date(startDateInput.value) : null;
            const endDate = endDateInput ? new Date(endDateInput.value) : null;

            // 如果结束日期有效，将其设置为当天的23:59:59，以包含整天
            if (endDate && !isNaN(endDate.getTime())) {
                endDate.setHours(23, 59, 59, 999);
            }

            emailRows.forEach(row => {
                const account = row.getAttribute('data-account').toLowerCase();
                const status = row.getAttribute('data-status');
                const subject = row.querySelector('.email-subject').textContent.toLowerCase();
                const sender = row.querySelector('.email-sender').textContent.toLowerCase();

                // 获取邮件日期
                const dateStr = row.querySelector('.email-col-date').textContent;
                const emailDate = new Date(dateStr);

                // 检查是否有附件（可以根据实际情况调整）
                const hasAttachment = row.classList.contains('has-attachment');

                // 匹配条件
                const accountMatch = !accountValue || account.includes(accountValue);
                const statusMatch = statusValue === 'all' || status === statusValue;
                const senderMatch = !senderValue || sender.includes(senderValue);
                const subjectMatch = !subjectValue || subject.includes(subjectValue);

                // 附件筛选
                let attachmentMatch = true;
                if (hasAttachmentsValue === 'yes') {
                    attachmentMatch = hasAttachment;
                } else if (hasAttachmentsValue === 'no') {
                    attachmentMatch = !hasAttachment;
                }

                // 日期筛选
                let dateMatch = true;
                if (startDate && !isNaN(startDate.getTime())) {
                    dateMatch = dateMatch && emailDate >= startDate;
                }
                if (endDate && !isNaN(endDate.getTime())) {
                    dateMatch = dateMatch && emailDate <= endDate;
                }

                // 综合所有筛选条件
                if (accountMatch && statusMatch && senderMatch && subjectMatch && attachmentMatch && dateMatch) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // 为所有筛选条件添加事件监听器
        if (accountFilter) accountFilter.addEventListener('input', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (senderFilter) senderFilter.addEventListener('input', applyFilters);
        if (subjectFilter) subjectFilter.addEventListener('input', applyFilters);
        if (hasAttachmentsFilter) hasAttachmentsFilter.addEventListener('change', applyFilters);
        if (startDateInput) startDateInput.addEventListener('change', applyFilters);
        if (endDateInput) endDateInput.addEventListener('change', applyFilters);

        // 添加行点击功能
        emailRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // 如果点击的是操作按钮，不进行跳转
                if (e.target.closest('.email-view-btn') || e.target.closest('.email-col-actions')) {
                    return;
                }

                // 获取查看链接并跳转
                const viewLink = this.querySelector('.email-view-btn').getAttribute('href');
                if (viewLink) {
                    window.location.href = viewLink;
                }
            });

            // 添加鼠标样式
            row.style.cursor = 'pointer';
        });
    }

    // 邮件详情页功能
    const replyBtn = document.getElementById('reply-btn');
    const forwardBtn = document.getElementById('forward-btn');
    const deleteBtn = document.getElementById('delete-btn');

    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            alert('回复功能尚未实现');
        });
    }

    if (forwardBtn) {
        forwardBtn.addEventListener('click', function() {
            alert('转发功能尚未实现');
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const emailId = this.getAttribute('data-id');
            if (!emailId) {
                alert('无法获取邮件ID');
                return;
            }

            if (confirm('确定要删除此邮件吗？此操作不可恢复。')) {
                // 显示加载状态
                this.disabled = true;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i> 删除中...';

                // 发送删除请求
                fetch(`/mail/delete/${emailId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('邮件已成功删除');
                        // 跳转回邮件列表
                        window.location.href = '/mail';
                    } else {
                        alert('删除失败: ' + (data.message || '未知错误'));
                        // 恢复按钮状态
                        this.disabled = false;
                        this.innerHTML = '<i class="bi bi-trash"></i> 删除';
                    }
                })
                .catch(error => {
                    console.error('删除邮件时出错:', error);
                    alert('删除邮件时出错: ' + error.message);
                    // 恢复按钮状态
                    this.disabled = false;
                    this.innerHTML = '<i class="bi bi-trash"></i> 删除';
                });
            }
        });
    }

    // 附件下载功能
    const attachmentLinks = document.querySelectorAll('.attachment-download');

    attachmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 添加下载中的视觉反馈
            const downloadIcon = this.querySelector('i');
            if (downloadIcon) {
                downloadIcon.className = 'bi bi-hourglass-split';

                // 下载完成后恢复图标
                setTimeout(() => {
                    downloadIcon.className = 'bi bi-download';
                }, 2000);
            }

            // 不阻止默认行为，允许浏览器处理下载
        });
    });
});
