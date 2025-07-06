// 革命事件坐标配置
const revolutionEvents = [
    {
        id: 'xinhai',
        name: '辛亥革命',
        coords: [30.52, 114.31],
        icon: 'flag',
        routes: [],
        description: '1911年推翻清朝统治的革命'
    },
    {
        id: 'wusi',
        name: '五四运动',
        coords: [39.90, 116.40],
        icon: 'users',
        routes: [],
        description: '1919年反帝反封建的爱国运动'
    },
    {
        id: 'nanhu',
        name: '中共一大',
        coords: [30.77, 120.76],
        icon: 'ship',
        routes: [],
        description: '1921年中国共产党成立的象征'
    },
    {
        id: 'nanchang',
        name: '南昌起义',
        coords: [28.68, 115.89],
        icon: 'gun',
        routes: [],
        description: '1927年中国共产党领导的武装起义'
    },
    {
        id: 'changzheng',
        name: '红军长征',
        coords: [36.03, 103.82], // 延安
        icon: 'route',
        routes: [
            [25.89, 116.03], // 瑞金
            [26.57, 106.71], // 遵义
            [30.67, 104.06], // 成都
            [36.03, 103.82]  // 延安
        ],
        description: '1934-1936年红军战略转移'
    },
    {
        id: 'kangzhan',
        name: '抗战胜利',
        coords: [39.85, 116.22],
        icon: 'crosshairs',
        routes: [],
        description: '1937-1945年中国抗击日本侵略'
    },
    {
        id: 'kaiguo',
        name: '开国大典',
        coords: [39.91, 116.40],
        icon: 'star',
        routes: [],
        description: '1949年中华人民共和国成立'
    }
];

// 初始化地图
document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('revolution-map').setView([35, 108], 5);
    
    // 加载深色地图瓦片
    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // 加载中国地图GeoJSON
    fetch('china.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    color: '#8B0000',
                    weight: 1.5,
                    fillColor: '#333333',
                    fillOpacity: 0.3
                }
            }).addTo(map);
            
            // 添加革命事件标记
            addRevolutionMarkers(map);
        });
});

// 添加革命事件标记
function addRevolutionMarkers(map) {
    revolutionEvents.forEach(event => {
        // 创建动态缩放图标
        function createDynamicIcon() {
            const zoom = map.getZoom();
            const size = Math.max(20, 30 * Math.pow(1.2, zoom - 5));
            const colors = {
                'xinhai': '#D4AF37',
                'wusi': '#9A1F1A',
                'nanhu': '#9A1F1A',
                'nanchang': '#9A1F1A',
                'changzheng': '#9A1F1A',
                'kangzhan': '#9A1F1A',
                'kaiguo': '#2E8B57'
            };
            return L.divIcon({
                html: `<i class="fas fa-${event.icon}" style="color:${colors[event.id]};font-size:${size}px;text-shadow:0 0 8px rgba(255,255,255,0.5);"></i>`,
                className: 'custom-marker',
                iconSize: [size, size]
            });
        }
        
        // 创建标记
        const marker = L.marker(event.coords, { 
            icon: createDynamicIcon()
        }).addTo(map);
        
        // 地图缩放时更新图标大小
        map.on('zoomend', function() {
            marker.setIcon(createDynamicIcon());
        });
        
        // 调整北京地区事件位置避免重叠
        if(['wusi', 'kangzhan', 'kaiguo'].includes(event.id)) {
            const displayPositions = {
                'wusi': [40.5, 117.0],  // 东北方向(距离x4)
                'kangzhan': [40.0, 116.0], // 西北方向
                'kaiguo': [39.3, 117.0]  // 东南方向(距离x4)
            };
            
            // 设置显示位置
            marker.setLatLng(displayPositions[event.id]);
            
            // 添加实际位置连线
            const line = L.polyline([event.coords, displayPositions[event.id]], {
                color: '#9A1F1A',
                weight: 1,
                dashArray: '5,5',
                opacity: 0.6
            }).addTo(map);
            
            // 绑定移除事件
            marker.on('remove', () => map.removeLayer(line));
            
            // 添加位置说明标记
            marker.locationHint = true;
        }
        
        // 绑定弹出窗口
        let popupContent = `
            <div class="event-card">
                <h3>${event.name}</h3>
                <i class="fas fa-${event.icon}"></i>
                <p class="event-description">${event.description}</p>`;
        
        popupContent += `
                <button class="explore-btn" onclick="window.location.href='events/${event.id}.html'">
                    点击探索
                </button>
            </div>`;
            
        marker.bindPopup(popupContent);
    });
}
