document.addEventListener('DOMContentLoaded', function() {
    const startSyncBtn = document.getElementById('start-sync-btn');
    const backBtn = document.getElementById('back-btn');
    const doneBtn = document.getElementById('done-btn');

    const progressContainer = document.getElementById('sync-progress');
    const progressFill = progressContainer.querySelector('.progress-fill');
    const progressStatus = progressContainer.querySelector('.progress-status');

    const resultContainer = document.getElementById('sync-result');
    const resultSummary = resultContainer.querySelector('.summary-text');
    const addedList = resultContainer.querySelector('.added-list');
    const removedList = resultContainer.querySelector('.removed-list');
    const updatedPasswordList = resultContainer.querySelector('.updated-password-list');
    const updatedStatusList = resultContainer.querySelector('.updated-status-list');

    startSyncBtn.addEventListener('click', function() {
        // 显示进度条，隐藏按钮
        progressContainer.style.display = 'block';
        resultContainer.style.display = 'none';
        startSyncBtn.disabled = true;
        backBtn.disabled = true;

        // 模拟进度，但速度更慢，适合处理大量数据
        let progress = 0;
        const interval = setInterval(() => {
            // 前30%快速增长
            if (progress < 30) {
                progress += 2;
            }
            // 30%-60%中速增长
            else if (progress < 60) {
                progress += 1;
            }
            // 60%-90%慢速增长
            else if (progress < 90) {
                progress += 0.5;
            }

            progressFill.style.width = `${Math.min(progress, 90)}%`;
            progressStatus.textContent = `正在同步...${Math.min(Math.round(progress), 90)}%`;

            if (progress >= 90) {
                clearInterval(interval);
            }
        }, 300);

        // 发送同步请求
        fetch('/accounts/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // 清除进度条定时器
            clearInterval(interval);

            if (data.success) {
                // 完成进度条
                progressFill.style.width = '100%';
                progressStatus.textContent = '同步完成！';

                // 显示结果
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    resultContainer.style.display = 'block';
                    startSyncBtn.style.display = 'none';
                    backBtn.style.display = 'none';
                    doneBtn.style.display = '';

                    // 更新结果摘要
                    const updatedPasswordCount = data.updatedPassword || 0;
                    const updatedStatusCount = data.updatedStatus || 0;
                    resultSummary.textContent = `同步完成！新增 ${data.added.length} 个账号，删除 ${data.removed.length} 个账号，更新 ${updatedPasswordCount} 个账号密码，更新 ${updatedStatusCount} 个账号状态。`;

                    // 更新新增账号列表
                    addedList.innerHTML = '';
                    if (data.added.length > 0) {
                        // 如果账号数量过多，只显示前10个和总数
                        if (data.added.length > 10) {
                            const summaryLi = document.createElement('li');
                            summaryLi.innerHTML = `<strong>共 ${data.added.length} 个新增账号，显示前10个：</strong>`;
                            addedList.appendChild(summaryLi);

                            // 只显示前10个
                            data.added.slice(0, 10).forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                addedList.appendChild(li);
                            });

                            // 添加"更多"提示
                            const moreLi = document.createElement('li');
                            moreLi.innerHTML = `<em>...还有 ${data.added.length - 10} 个账号未显示</em>`;
                            addedList.appendChild(moreLi);
                        } else {
                            // 账号数量不多，全部显示
                            data.added.forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                addedList.appendChild(li);
                            });
                        }
                    } else {
                        const li = document.createElement('li');
                        li.textContent = '无新增账号';
                        addedList.appendChild(li);
                    }

                    // 更新删除账号列表
                    removedList.innerHTML = '';
                    if (data.removed.length > 0) {
                        // 如果账号数量过多，只显示前10个和总数
                        if (data.removed.length > 10) {
                            const summaryLi = document.createElement('li');
                            summaryLi.innerHTML = `<strong>共 ${data.removed.length} 个删除账号，显示前10个：</strong>`;
                            removedList.appendChild(summaryLi);

                            // 只显示前10个
                            data.removed.slice(0, 10).forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                removedList.appendChild(li);
                            });

                            // 添加"更多"提示
                            const moreLi = document.createElement('li');
                            moreLi.innerHTML = `<em>...还有 ${data.removed.length - 10} 个账号未显示</em>`;
                            removedList.appendChild(moreLi);
                        } else {
                            // 账号数量不多，全部显示
                            data.removed.forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                removedList.appendChild(li);
                            });
                        }
                    } else {
                        const li = document.createElement('li');
                        li.textContent = '无删除账号';
                        removedList.appendChild(li);
                    }

                    // 更新密码更新列表
                    updatedPasswordList.innerHTML = '';
                    const passwordUpdates = data.updated ? data.updated.filter(account => account.updateType === 'password') : [];
                    if (passwordUpdates.length > 0) {
                        // 如果账号数量过多，只显示前10个和总数
                        if (passwordUpdates.length > 10) {
                            const summaryLi = document.createElement('li');
                            summaryLi.innerHTML = `<strong>共 ${passwordUpdates.length} 个更新密码，显示前10个：</strong>`;
                            updatedPasswordList.appendChild(summaryLi);

                            // 只显示前10个
                            passwordUpdates.slice(0, 10).forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                updatedPasswordList.appendChild(li);
                            });

                            // 添加"更多"提示
                            const moreLi = document.createElement('li');
                            moreLi.innerHTML = `<em>...还有 ${passwordUpdates.length - 10} 个账号未显示</em>`;
                            updatedPasswordList.appendChild(moreLi);
                        } else {
                            // 账号数量不多，全部显示
                            passwordUpdates.forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = account.email;
                                updatedPasswordList.appendChild(li);
                            });
                        }
                    } else {
                        const li = document.createElement('li');
                        li.textContent = '无更新密码';
                        updatedPasswordList.appendChild(li);
                    }

                    // 更新状态更新列表
                    updatedStatusList.innerHTML = '';
                    const statusUpdates = data.updated ? data.updated.filter(account => account.updateType === 'status') : [];
                    if (statusUpdates.length > 0) {
                        // 如果账号数量过多，只显示前10个和总数
                        if (statusUpdates.length > 10) {
                            const summaryLi = document.createElement('li');
                            summaryLi.innerHTML = `<strong>共 ${statusUpdates.length} 个更新状态，显示前10个：</strong>`;
                            updatedStatusList.appendChild(summaryLi);

                            // 只显示前10个
                            statusUpdates.slice(0, 10).forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = `${account.email} (${account.oldStatus} → ${account.newStatus})`;
                                updatedStatusList.appendChild(li);
                            });

                            // 添加"更多"提示
                            const moreLi = document.createElement('li');
                            moreLi.innerHTML = `<em>...还有 ${statusUpdates.length - 10} 个账号未显示</em>`;
                            updatedStatusList.appendChild(moreLi);
                        } else {
                            // 账号数量不多，全部显示
                            statusUpdates.forEach(account => {
                                const li = document.createElement('li');
                                li.textContent = `${account.email} (${account.oldStatus} → ${account.newStatus})`;
                                updatedStatusList.appendChild(li);
                            });
                        }
                    } else {
                        const li = document.createElement('li');
                        li.textContent = '无更新状态';
                        updatedStatusList.appendChild(li);
                    }
                }, 500);
            } else {
                // 显示错误
                progressFill.style.width = '100%';
                progressStatus.textContent = '同步失败！';
                progressFill.style.backgroundColor = 'var(--danger-color)';

                setTimeout(() => {
                    alert(`同步失败：${data.error || '未知错误'}`);
                    startSyncBtn.disabled = false;
                    backBtn.disabled = false;
                }, 1000);
            }
        })
        .catch(error => {
            // 清除进度条定时器
            clearInterval(interval);

            // 显示错误
            progressFill.style.width = '100%';
            progressStatus.textContent = '同步失败！';
            progressFill.style.backgroundColor = 'var(--danger-color)';

            console.error('Error:', error);
            setTimeout(() => {
                alert('同步失败，请重试');
                startSyncBtn.disabled = false;
                backBtn.disabled = false;
            }, 1000);
        });
    });
});
