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
            coll.setAttribute('aria-expanded', 'false');

            // 初始化 maxHeight 为 0（折叠状态）
            content.style.maxHeight = content.classList.contains('active') ? content.scrollHeight + 'px' : (content.style.maxHeight || '');

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

    // 云盘链接功能
    // 已移除页面顶部对 openLink / copyLink 的重复绑定，使用后面的 addAccessibleClick 统一绑定（避免重复事件）

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
    // 绑定“密码获取-渠道二”按钮逻辑为人工客服弹窗
    document.getElementById('getKey').onclick = function() {
        document.getElementById('serviceModal').style.display = 'block';
    };

    // 右下角浮动按钮功能
    const qrButton = document.getElementById('qrButton');
    const topButton = document.getElementById('topButton');
    const qrBtn = document.getElementById('qrCodeBtn');
    const topBtn = document.getElementById('backToTop');
    const wechatQrContainer = document.getElementById('wechatQrContainer');
    qrBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (qrButton.classList.contains('active')) {
            qrButton.classList.remove('active');
            wechatQrContainer.style.opacity = '0';
            setTimeout(() => {
                wechatQrContainer.style.display = 'none';
            }, 300);
        } else {
            qrButton.classList.add('active');
            wechatQrContainer.style.display = 'block';
            wechatQrContainer.style.opacity = '1';
        }
    });
    qrButton.addEventListener('mouseenter', function() {
        if (!qrButton.classList.contains('active')) {
            wechatQrContainer.style.display = 'block';
            wechatQrContainer.style.opacity = '1';
        }
    });
    qrButton.addEventListener('mouseleave', function() {
        if (!qrButton.classList.contains('active')) {
            wechatQrContainer.style.opacity = '0';
            setTimeout(() => {
                wechatQrContainer.style.display = 'none';
            }, 300);
        }
    });
    topBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!topButton.classList.contains('active')) {
            topButton.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                topButton.classList.remove('active');
            }, 500);
        }
    });
    document.addEventListener('click', function(event) {
        if (!qrButton.contains(event.target) && !wechatQrContainer.contains(event.target)) {
            qrButton.classList.remove('active');
            wechatQrContainer.style.opacity = '0';
            setTimeout(() => {
                wechatQrContainer.style.display = 'none';
            }, 300);
        }
        if (!topButton.contains(event.target)) {
            topButton.classList.remove('active');
        }
    });
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