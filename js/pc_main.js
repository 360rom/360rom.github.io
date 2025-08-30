// 历史版本说明弹窗功能
var module = (function (b, a) {
    a.init = function () { a.addListener(); };
    a.addListener = function () {
        // 只保留历史版本说明弹窗功能
        b(document).on("click", ".history-des", function () {
            var k = b(this);
            var c = k.data("version");
            var j = k.data("desc");
            b("#descDetails .ld-title").text(c + "更新说明");
            var d = "";
            for (var f in j) {
                if (j[f]) {
                    d += '<div class="praph"><p class="praph-t">' + f + "</p>";
                    var h = j[f].split(";");
                    for (var e = 0, g = h.length; e < g; e++) {
                        d += '<p class="praph-d">' + h[e] + "</p>";
                    }
                    d += "</div>";
                }
            }
            b("#descDetails .praph-pannel").html(d);
            b(".desc-frame").show();
        });
        b(document).on("click", ".tp-close", function () {
            b(".desc-frame").hide();
        });
    };
    return a;
}(jQuery, module || {}));
jQuery(function () { module.init(); });

// 返回顶部功能
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    // 点击返回顶部
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
