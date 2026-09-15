document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化视频播放器
    const player = new Plyr('#player');

    // 2. 弹窗控制逻辑
    const modals = {
        wx: document.getElementById('wxCodeModal'),
        dl: document.getElementById('downloadModal')
    };

    const toggleModal = (modal, action) => {
        modal.classList[action === 'open' ? 'add' : 'remove']('active');
    };

    // 绑定打开按钮
    document.getElementById('contactBtn').onclick = () => toggleModal(modals.wx, 'open');
    document.getElementById('onlineReserveBtn').onclick = () => toggleModal(modals.wx, 'open');
    document.getElementById('downloadToolBtn').onclick = () => toggleModal(modals.dl, 'open');

    // 绑定关闭按钮 (所有含有 close-btn 类的元素)
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = () => {
            toggleModal(modals.wx, 'close');
            toggleModal(modals.dl, 'close');
        };
    });

    // 点击外部关闭
    window.onclick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    };

    // 3. FAQ 手风琴效果
    document.querySelectorAll('.faq-question').forEach(q => {
        q.onclick = () => q.parentElement.classList.toggle('active');
    });

    // 4. 刷机步骤自动轮播
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    const runStepAnimation = () => {
        steps.forEach((s, i) => s.classList.toggle('active', i === currentStep));
        currentStep = (currentStep + 1) % steps.length;
    };
    runStepAnimation(); // 初始化执行一次
    setInterval(runStepAnimation, 3000);

    // 5. 平滑滚动
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.onclick = (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };
    });
});