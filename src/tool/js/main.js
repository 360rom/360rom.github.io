document.addEventListener('DOMContentLoaded', function() {
    // 公告滚动功能
    let currentAnnouncement = 0;
    const totalAnnouncements = 3;
    const announcementHeight = 60;
    const announcements = document.querySelectorAll('.announcement-item');
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

    // 折叠面板功能
    function setupCollapsible(id) {
        const coll = document.getElementById(id);
        coll.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
    setupCollapsible('passwordExplanation');
    setupCollapsible('passwordInstructions');

    // 云盘链接功能
    document.getElementById('openLink').addEventListener('click', function() {
        const url = document.getElementById('cloudLink').value;
        window.open(url, '_blank');
    });
    document.getElementById('copyLink').addEventListener('click', function() {
        const linkInput = document.getElementById('cloudLink');
        linkInput.select();
        document.execCommand('copy');
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fa fa-check"></i> 已复制';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });

    // 模态框功能
    function setupModal(buttonId, modalId, closeId) {
        const modal = document.getElementById(modalId);
        const btn = document.getElementById(buttonId);
        const closeBtn = document.getElementById(closeId);
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
    setupModal('showInfo', 'infoModal', 'closeInfoModal');
    setupModal('showInfo2', 'infoModal', 'closeInfoModal');
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
    linkInput.select();
    document.execCommand('copy');
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fa fa-check"></i> 已复制';
    setTimeout(() => {
        this.innerHTML = originalText;
    }, 2000);
});