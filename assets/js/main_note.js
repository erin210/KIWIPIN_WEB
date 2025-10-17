
var windowHeight = $(window).height(); // 瀏覽器高度

// sticky
function handleStickyPic() {
    const $stickyPic = $('.sticky_pic');
    const $areaInfo = $('.areaInformation');
    const areaInfoRect = $areaInfo[0].getBoundingClientRect();
    
    const stickyPicHeight = $stickyPic.outerHeight();
    const windowHeight = $(window).height(); // 瀏覽器高度
    const bufferDistance = 450;

    if (areaInfoRect.top <= windowHeight - stickyPicHeight - bufferDistance &&
        areaInfoRect.bottom > stickyPicHeight + bufferDistance) {
        $stickyPic.addClass('fixed').removeClass('leave');
    } else if (areaInfoRect.bottom <= stickyPicHeight + bufferDistance) {
        $stickyPic.addClass('leave').removeClass('fixed');
    } else {
        $stickyPic.removeClass('fixed leave');
    }
}

// footer effect
function handleFooterEffect() {
    const $main = $('main');
    const $footer = $('footer'); 
    const mainRect = $main[0].getBoundingClientRect(); 
    const triggerPoint = mainRect.bottom;
    const progress = Math.min(Math.max((windowHeight - triggerPoint) / 150, 0), 1);

    if(progress<0.8){
        $footer.removeClass('footEffect');
    }else{
        $footer.addClass('footEffect');

    }
}

//BN effect
let lastScrollTop = 0;
function handleAreaMainBNEffect() {
    const scrollTop = $(window).scrollTop();
    const $areaMainBN = $('.areaMainBN');

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        $areaMainBN.addClass('mainBnEffect');
    } else if (scrollTop < lastScrollTop && scrollTop < 550) {
        $areaMainBN.removeClass('mainBnEffect');
    }

    lastScrollTop = scrollTop;
}

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
        smoothTouch: false  //觸控屏平滑
    });

    // 更新 Lenis
    function animate(time) {
        lenis.raf(time); 
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});