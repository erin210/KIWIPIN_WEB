$(document).ready(function () {
    // 當點擊選單開關按鈕時，顯示/隱藏選單
    $(document).on('click', '#menu-toggle', function () {
        $(this).toggleClass('active');
        $('#sidr').toggleClass('sidr');
    });

    // 當點擊選單項目時，收起選單並延遲跳轉
    $('#sidr a').on('click', function (event) {
        event.preventDefault(); // 阻止直接跳轉

        var targetUrl = $(this).attr('href'); // 獲取點擊的連結

        // 給動畫一點時間來結束
        setTimeout(function () {
            $('#menu-toggle').removeClass('active'); // 讓開關按鈕回復初始狀態
            $('#sidr').removeClass('sidr'); // 隱藏選單

            // 延遲跳轉
            window.location.href = targetUrl; // 執行跳轉
        }, 300); // 這裡設置為300ms，根據你的動畫時間來調整
    });

    // 當點擊選單以外的區域時，收起選單
    $(document).on('click', function (event) {
        // 如果點擊的區域不是選單或選單開關按鈕，隱藏選單
        if (!$(event.target).closest('#sidr').length && !$(event.target).closest('#menu-toggle').length) {
            $('#menu-toggle').removeClass('active');

            // 延遲隱藏選單的動作
            setTimeout(function () {
                $('#sidr').removeClass('sidr');
            }, 300); // 延遲300ms，根據你的動畫時間來調整
        }
    });
});

$(document).on('click', '.navLinkIndex', function (event) {
    event.preventDefault(event);

    const listID = $(this).data('target');
    const targetElement = $("#" + listID);

    const scrollToTarget = (element) => {
        const targetPosition = element.offset().top - 20;
        $('html, body').animate({
            scrollTop: targetPosition
        }, 500);
    };

    if (targetElement.length) {
        scrollToTarget(targetElement);
        window.history.pushState(null, null, `#${listID}`);
    } else {
        window.location.href = `/#${listID}`;
    }
});

//加 active
const navList_a = '#sidr a';
$(document).on('click', navList_a, function () {
    // event.preventDefault();

    // 檢查是否有其他元素擁有 .active 類別
    if ($(navList_a).hasClass('active')) {
        // 如果有，移除 .active 類別
        $(navList_a).removeClass('active');
    }

    // 無論如何，為當前點擊的元素添加 .active 類別
    $(this).addClass('active');
    if ($(this).hasClass('buyPoint')) {}
});


//平滑
if (typeof Lenis === 'undefined') {
    console.error('Lenis library not loaded.');
} else {
    console.log('Lenis is loaded successfully.');
}
document.addEventListener('DOMContentLoaded', function () {
    // 初始化 Lenis
    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true, // 滾輪平滑
        smoothTouch: false //觸控屏平滑
    });

    // 更新 Lenis
    function animate(time) {
        lenis.raf(time);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});

//換語言
$(document).on('click', '#langListItem li', function () {
    const selectLang = $(this).data('lang');
    console.log(selectLang);
    // langDefault = selectLang;
    // deleteCookie('userLang');
    // setCookie(langDefault);
    window.location.reload();

})