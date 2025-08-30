// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 显示运行时间
  function updateRuntime() {
    const birthDay = new Date('2022-03-16T00:00:00Z');
    const now = new Date();
    const seconds = Math.floor((now - birthDay) / 1000);

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const runtimeElement = document.getElementById('showsectime');
    if (runtimeElement) {
      runtimeElement.innerHTML = `已运行：<span style="color:#ff4d4f;font-weight:bold;">${days}天</span>` +
        `<span style="color:#1890ff;font-weight:bold;">${hours}小时</span>` +
        `<span style="color:#52c41a;font-weight:bold;">${minutes}分</span>` +
        `<span style="color:#faad14;font-weight:bold;">${secs}秒</span>`;
    }
  }

  // 初始化运行时间显示
  updateRuntime();
  // 每秒更新一次
  setInterval(updateRuntime, 1000);

  // 权限禁止相关功能
  const disabledActions = {
    contextMenu: true,
    ctrlS: true,
    f12: true,
    frameBusting: true
  };
  function showPermissionAlert(message = "权限禁止") {
    let alertEl = document.querySelector('.permission-alert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.className = 'permission-alert';
      document.body.appendChild(alertEl);
    }
    alertEl.textContent = message;
    alertEl.classList.add('show');
    setTimeout(() => alertEl.classList.remove('show'), 2000);
  }
  if (disabledActions.contextMenu) {
    document.addEventListener('contextmenu', function (e) {
      if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        showPermissionAlert();
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    const { keyCode, ctrlKey, metaKey } = e;
    const isCtrl = ctrlKey || metaKey;
    if (
      (disabledActions.ctrlS && isCtrl && keyCode === 83) ||
      (disabledActions.f12 && keyCode === 123)
    ) {
      e.preventDefault();
      showPermissionAlert();
    }
  });
  if (disabledActions.frameBusting && window.top !== window.self) {
    try {
      window.top.location.href = window.self.location.href;
    } catch {
      document.body.innerHTML = '<h1>权限禁止iframe中显示</h1>';
    }
  }

  // 模态框逻辑（关于、邮件、评价）
  // 关于模态框
  var aboutModal = document.getElementById("aboutModal");
  var aboutLink = document.getElementById("aboutLink");
  var closeAboutModal = document.getElementById("closeAboutModal");
  if (aboutLink && aboutModal && closeAboutModal) {
    aboutLink.onclick = function () {
      aboutModal.style.display = "block";
    };
    closeAboutModal.onclick = function () {
      aboutModal.style.display = "none";
    };
    window.addEventListener('click', function (event) {
      if (event.target == aboutModal) {
        aboutModal.style.display = "none";
      }
    });
    window.addEventListener('keydown', function (event) {
      if (event.key === "Escape" && aboutModal.style.display === "block") {
        aboutModal.style.display = "none";
      }
    });
  }

  // 邮件模态框
  var emailModal = document.getElementById("emailModal");
  var emailLink = document.getElementById("emailLink");
  var closeEmailModal = document.getElementById("closeEmailModal");
  if (emailLink && emailModal && closeEmailModal) {
    emailLink.onclick = function () {
      emailModal.style.display = "block";
    };
    closeEmailModal.onclick = function () {
      emailModal.style.display = "none";
    };
    window.addEventListener('click', function (event) {
      if (event.target == emailModal) {
        emailModal.style.display = "none";
      }
    });
    window.addEventListener('keydown', function (event) {
      if (event.key === "Escape" && emailModal.style.display === "block") {
        emailModal.style.display = "none";
      }
    });
  }

  // 用户评价模态框
  var evaluateModal = document.getElementById("evaluateModal");
  var evaluateLink = document.getElementById("evaluateLink");
  var closeEvaluateModal = document.getElementById("closeEvaluateModal");
  if (evaluateLink && evaluateModal && closeEvaluateModal) {
    evaluateLink.onclick = function () {
      evaluateModal.style.display = "block";
    };
    closeEvaluateModal.onclick = function () {
      evaluateModal.style.display = "none";
    };
    window.addEventListener('click', function (event) {
      if (event.target == evaluateModal) {
        evaluateModal.style.display = "none";
      }
    });
    window.addEventListener('keydown', function (event) {
      if (event.key === "Escape" && evaluateModal.style.display === "block") {
        evaluateModal.style.display = "none";
      }
    });
  }

  // 置顶按钮
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // 置底按钮
  const scrollBottomBtn = document.getElementById('scroll-bottom-btn');
  if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener('click', function () {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  // 音乐播放器初始化（建议外链播放器JS，结构已在HTML）
  window.bgChange = function () {
    var lis = document.querySelectorAll('.lib');
    for (var i = 0; i < lis.length; i += 2) {
      lis[i].style.background = 'rgba(246, 246, 246, 0.5)';
    }
  };
  window.onload = window.bgChange;
  // 播放器相关JS建议外链

  // 右下角按钮与微信二维码弹窗功能
  // 微信二维码显示/隐藏功能
  const wechatBtn = document.getElementById('wechat-btn');
  const wechatQrcode = document.getElementById('wechat-qrcode');
  if (wechatBtn && wechatQrcode) {
    wechatBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (wechatQrcode.classList.contains('active')) {
        wechatQrcode.classList.remove('active');
      } else {
        var btnRect = wechatBtn.getBoundingClientRect();
        var qrcodeRect = wechatQrcode.getBoundingClientRect();
        var left = btnRect.left - qrcodeRect.width - 32;
        var top = btnRect.top + (btnRect.height - qrcodeRect.height) / 2;
        if (left < 0) left = btnRect.right + 12;
        wechatQrcode.style.left = left + 'px';
        wechatQrcode.style.top = top + 'px';
        wechatQrcode.style.right = '';
        wechatQrcode.style.bottom = '';
        wechatQrcode.classList.add('active');
      }
    });
    wechatQrcode.addEventListener('click', function (e) {
      e.stopPropagation();
      wechatQrcode.classList.remove('active');
    });
    document.addEventListener('click', function (e) {
      if (wechatQrcode.classList.contains('active') &&
        !wechatQrcode.contains(e.target) &&
        e.target !== wechatBtn) {
        wechatQrcode.classList.remove('active');
      }
    });
  }
});