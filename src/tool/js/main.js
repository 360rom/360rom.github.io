document.addEventListener('DOMContentLoaded', function() {
    // 公告滚动功能
    let currentAnnouncement = 0;
    const totalAnnouncements = 3;
    const announcementHeight = 60;
    const announcements = document.querySelectorAll('.announcement-item');
    // 新增：读取html中是否允许滚动
    const scrollSwitch = document.getElementById('announcementScroll');
    const enableScroll = scrollSwitch ? (scrollSwitch.value === 'true') : true;
    // 公告自适应：如果不滚动，全部显示，无需transform
    if (enableScroll) {
        announcements.forEach((item, i) => {
            item.style.transform = `translateY(${(i - currentAnnouncement) * announcementHeight}px)`;
        });
        function showAnnouncement(index) {
            announcements.forEach((item, i) => {
                item.style.transform = `translateY(${(i - index) * announcementHeight}px)`;
            });
        }
        function nextAnnouncement() {
            currentAnnouncement = (currentAnnouncement + 1) % totalAnnouncements;
            showAnnouncement(currentAnnouncement);
        }
        setInterval(nextAnnouncement, 3000);
    } else {
        // 不滚动时全部显示，无需transform
        announcements.forEach(item => {
            item.style.transform = '';
        });
    }

    // 折叠面板功能（改为通用绑定，支持 Collapsible、Collapsible1..9、以及 .collapsible）
    function setupAllCollapsibles() {
        // 先选取带有 class .collapsible 的元素，再选取 id 中包含 Collapsible 的元素（大小写兼容）
        const elems = new Set();
        document.querySelectorAll('.collapsible').forEach(e => elems.add(e));
        // 尽量避免遍历过多，查找可能包含 Collapsible 的元素
        document.querySelectorAll('[id]').forEach(e => {
            if (e.id && e.id.toLowerCase().includes('collapsible')) elems.add(e);
        });
        const pairs = []; // 存储 {coll, content}
        Array.from(elems).forEach(coll => {
            if (!coll || coll._collapsibleInitialized) return;
            coll._collapsibleInitialized = true;

            const collId = (coll.id || '').trim();
            let content = null;

            if (collId) {
                const idLower = collId.toLowerCase();

                // 1) CollapsibleN -> ContentN （支持 Collapsible1、collapsible01 等）
                const mNum = collId.match(/collapsible(\d+)$/i);
                if (mNum) {
                    const contentId = collId.replace(/collapsible(\d+)$/i, 'Content$1');
                    content = document.getElementById(contentId) || document.getElementById(contentId.replace(/^./, c => c.toLowerCase()));
                }

                // 2) 前缀 Collapsible -> 前缀 Content（如 toolCollapsible -> toolContent）
                if (!content && /collapsible$/i.test(collId)) {
                    const contentId = collId.replace(/collapsible$/i, 'Content');
                    content = document.getElementById(contentId) || document.getElementById(contentId.replace(/^./, c => c.toLowerCase()));
                }

                // 3) 任意位置的 Collapsible 替换为 Content（更通用）
                if (!content && /collapsible/i.test(collId)) {
                    const contentId = collId.replace(/collapsible/i, 'Content');
                    content = document.getElementById(contentId) || document.getElementById(contentId.replace(/^./, c => c.toLowerCase()));
                }

                // 4) 常见后缀映射： Instructions/Explanation -> Content
                if (!content && /instructions$/i.test(collId)) {
                    content = document.getElementById(collId.replace(/Instructions$/i, 'Content'));
                }
                if (!content && /explanation$/i.test(collId)) {
                    content = document.getElementById(collId.replace(/Explanation$/i, 'Content'));
                }
            }

            // 5) 回退到紧随其后的兄弟元素（保持兼容旧结构）
            if (!content) {
                let sibling = coll.nextElementSibling;
                while (sibling) {
                    // 优先选择 class 包含 content 的元素
                    if (sibling.nodeType === 1 && (sibling.classList.contains('content') || sibling.classList.contains('panel') || sibling.tagName.toLowerCase() === 'div')) {
                        content = sibling;
                        break;
                    }
                    sibling = sibling.nextElementSibling;
                }
            }

            if (!content) return;

            // 可访问性及键盘支持
            coll.setAttribute('tabindex', coll.getAttribute('tabindex') || '0');
            coll.setAttribute('role', 'button');

            // 新增：优先从 data-expanded 属性读取初始状态（支持 "true"/"false"，不区分大小写）
            const dataExpanded = coll.getAttribute('data-expanded');
            let initialExpanded;
            if (dataExpanded === null || dataExpanded === undefined || dataExpanded === '') {
                // 回退到原始行为：根据 class active 判断
                initialExpanded = coll.classList.contains('active');
            } else {
                initialExpanded = String(dataExpanded).toLowerCase() === 'true';
            }

            coll.setAttribute('aria-expanded', initialExpanded ? 'true' : 'false');

            // 初始化 maxHeight 与图标
            if (initialExpanded) {
                coll.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                coll.classList.remove('active');
                content.style.maxHeight = null;
            }

            // 初始化图标（fa-chevron-up 表示展开，fa-chevron-down 表示收起）
            const initIcon = coll.querySelector('i');
            if (initIcon) {
                initIcon.classList.remove('fa-chevron-up', 'fa-chevron-down');
                initIcon.classList.add(initialExpanded ? 'fa-chevron-up' : 'fa-chevron-down');
            }

            function toggleColl(e) {
                if (e && e.type === 'keydown' && e.key === ' ') e.preventDefault();

                coll.classList.toggle('active');
                if (coll.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    coll.setAttribute('aria-expanded', 'true');
                } else {
                    content.style.maxHeight = null;
                    coll.setAttribute('aria-expanded', 'false');
                }

                // 切换图标（fa-chevron-up/down）
                const icon = coll.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-up');
                    icon.classList.toggle('fa-chevron-down');
                }
            }

            coll.addEventListener('click', toggleColl);
            coll.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    toggleColl.call(this, e);
                }
            });

            pairs.push({ coll, content });
        });

        // 窗口大小改变时，重新计算已展开项的高度，避免内容被截断
        window.addEventListener('resize', function() {
            pairs.forEach(p => {
                if (p.coll.classList.contains('active')) {
                    p.content.style.maxHeight = p.content.scrollHeight + 'px';
                }
            });
        });
    }
    // 立即初始化页面上所有折叠项
    setupAllCollapsibles();
    // 模态框功能
    function setupModal(buttonId, modalId, closeId) {
        const modal = document.getElementById(modalId);
        const btn = document.getElementById(buttonId);
        const closeBtn = document.getElementById(closeId);
        // 增加存在性检查，避免找不到元素时报错
        if (!modal || !btn || !closeBtn) return;
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
        window.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
    setupModal('showInfo2', 'infoModal', 'closeInfoModal');
    // 将“刷机包”中的说明按钮已迁移到 Collapsible3（id: toolShowInfo）
    setupModal('toolShowInfo', 'infoModal', 'closeInfoModal');
    setupModal('humanService', 'serviceModal', 'closeServiceModal');
    // 绑定“密码获取-渠道二”按钮逻辑为人工客服弹窗（安全绑定，避免因元素不存在报错）
    const getKeyBtnSafe = document.getElementById('getKey');
    if (getKeyBtnSafe) {
        getKeyBtnSafe.addEventListener('click', function () {
            const svcModal = document.getElementById('serviceModal');
            if (svcModal) svcModal.style.display = 'block';
        });
    }

    // 右下角浮动按钮功能（稳健实现，带键盘支持与鼠标悬停）
    (function () {
        const qrButton = document.getElementById('qrButton');
        const topButton = document.getElementById('topButton');
        const qrBtn = document.getElementById('qrCodeBtn');
        const topBtn = document.getElementById('backToTop');
        const wechatQrContainer = document.getElementById('wechatQrContainer');

        // 简单存在性校验，缺少任何关键元素则退化为无操作（不抛错）
        if (!qrButton || !qrBtn || !wechatQrContainer) {
            // 如果没有页面上的二维码区域则直接返回，不影响其它功能
        } else {
            // 行为说明：
            // - 鼠标移入（mouseenter）显示 QR（临时显示）
            // - 鼠标移出（mouseleave）隐藏（仅当未通过点击固定显示）
            // - 点击按钮切换“固定显示”状态（点击显示并固定，再次点击取消固定并隐藏）
            let shownByClick = false;

            function showQr(persistent) {
                qrButton.classList.add('active');
                wechatQrContainer.style.display = 'block';
                requestAnimationFrame(() => {
                    wechatQrContainer.style.opacity = '1';
                    wechatQrContainer.style.transform = 'scale(1)';
                });
                qrBtn.setAttribute('aria-expanded', 'true');
                if (persistent) shownByClick = true;
            }
            function hideQr(force) {
                // force 表示强制隐藏（例如全局点击或取消固定），否则如果已被点击固定则不隐藏
                if (!force && shownByClick) return;
                qrButton.classList.remove('active');
                wechatQrContainer.style.opacity = '0';
                wechatQrContainer.style.transform = 'scale(0.95)';
                qrBtn.setAttribute('aria-expanded', 'false');
                setTimeout(() => {
                    if (wechatQrContainer) wechatQrContainer.style.display = 'none';
                }, 300);
                if (force) shownByClick = false;
                // 如果非强制隐藏，也在需要时清除固定标识（如点击关闭会传 true）
            }

            // 鼠标移入显示（临时）
            qrButton.addEventListener('mouseenter', function () {
                try {
                    showQr(false);
                } catch (err) {
                    console.warn('qrButton mouseenter handler error', err);
                }
            });

            // 鼠标移出：若未通过点击固定显示则隐藏；若已固定则保持显示
            qrButton.addEventListener('mouseleave', function () {
                try {
                    hideQr(false);
                } catch (err) {
                    console.warn('qrButton mouseleave handler error', err);
                }
            });

            // 点击切换：若已固定则取消固定并隐藏；否则固定显示
            qrBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isVisible = window.getComputedStyle(wechatQrContainer).display === 'block' && qrButton.classList.contains('active');
                if (shownByClick) {
                    // 已被点击固定 -> 取消固定并隐藏
                    hideQr(true);
                } else {
                    // 未被固定 -> 固定显示
                    showQr(true);
                }
            });
            qrBtn.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    qrBtn.click();
                }
            });
        }

        // 返回顶部按钮（独立绑定，带存在性检查与键盘支持）
        if (topBtn && topButton) {
            topBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!topButton.classList.contains('active')) {
                    topButton.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => {
                        topButton.classList.remove('active');
                    }, 500);
                }
            });
            topBtn.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    topBtn.click();
                }
            });
        }

        // 全局点击隐藏（防止 null 引用）
        document.addEventListener('click', function (event) {
            try {
                if (qrButton && wechatQrContainer && !qrButton.contains(event.target) && !wechatQrContainer.contains(event.target)) {
                    qrButton.classList.remove('active');
                    wechatQrContainer.style.opacity = '0';
                    setTimeout(() => {
                        if (wechatQrContainer) wechatQrContainer.style.display = 'none';
                    }, 300);
                }
                if (topButton && !topButton.contains(event.target)) {
                    topButton.classList.remove('active');
                }
            } catch (e) {
                // 防御：任何运行时异常都不应中断页面其它脚本
                console.warn('Floating buttons hide handler error', e);
            }
        });
    })();

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
    }
    updateTime();
    setInterval(updateTime, 60000);
});
// 优化 a.btn 事件绑定，确保可用
function addAccessibleClick(id, handler) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', handler);
    el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            handler.call(this, e);
        }
    });
    el.setAttribute('tabindex', '0');
}
addAccessibleClick('openLink', function() {
    const url = document.getElementById('cloudLink').value;
    window.open(url, '_blank');
});
addAccessibleClick('copyLink', function() {
    const linkInput = document.getElementById('cloudLink');
    if (!linkInput) return;
    const textToCopy = linkInput.value || '';
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa fa-check"></i> 已复制';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            // fallback
            linkInput.select();
            try { document.execCommand('copy'); } catch (e) {}
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa fa-check"></i> 已复制';
            setTimeout(() => { this.innerHTML = originalText; }, 2000);
        });
    } else {
        // 兼容老浏览器
        linkInput.select();
        try { document.execCommand('copy'); } catch (e) {}
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fa fa-check"></i> 已复制';
        setTimeout(() => { this.innerHTML = originalText; }, 2000);
    }
});