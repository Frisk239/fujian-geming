// 预加载动画控制
document.addEventListener('DOMContentLoaded', function() {
    // 隐藏预加载动画
    gsap.to(".loader", {
        opacity: 0,
        duration: 0.5,
        delay: 1.5,
        onComplete: function() {
            document.querySelector(".loader").style.display = "none";
        }
    });

    // 初始化地图
    const map = L.map('revolution-map', {
        minZoom: 4,
        maxZoom: 8,
        maxBounds: [[15, 70], [55, 140]]
    }).setView([35, 105], 5);
    
    // 纸质黄地图样式
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles'
    }).addTo(map);

    // 为所有页面添加导航栏
    setupNavigation();
});

// 导航栏设置
function setupNavigation() {
    // 游戏页面添加退出按钮
    if (window.location.pathname.includes('games/')) {
        const exitBtn = document.createElement('a');
        exitBtn.className = 'exit-btn';
        exitBtn.href = window.location.pathname.replace('games/', 'events/');
        exitBtn.innerHTML = '退出游戏';
        document.querySelector('.main-nav').appendChild(exitBtn);
    }
}
