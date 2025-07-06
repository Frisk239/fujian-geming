// 福建革命事件坐标配置
const revolutionEvents = [
    {
        id: 'yongding',
        name: '永定暴动',
        coords: [24.72, 116.73],
        icon: 'gun',
        routes: [],
        description: '1928年福建规模最大的农民武装暴动，首创"抽多补少"土地分配政策'
    },
    {
        id: 'gutian',
        name: '古田会议',
        coords: [25.12, 116.42],
        icon: 'users',
        routes: [],
        description: '1929年确立"思想建党、政治建军"原则，成为建党建军纲领性文件'
    },
    {
        id: 'minxi',
        name: '闽西革命根据地',
        coords: [25.10, 116.10],
        icon: 'map-marked-alt',
        routes: [],
        description: '中央苏区重要组成部分，为红军提供重要兵源和物资'
    },
    {
        id: 'minzhong',
        name: '闽中三年游击战争',
        coords: [25.43, 119.01],
        icon: 'running',
        routes: [],
        description: '南方三年游击战争重要组成部分，建立罗汉里等游击根据地'
    },
    {
        id: 'houtian',
        name: '后田暴动',
        coords: [24.98, 117.03],
        icon: 'fist-raised',
        routes: [],
        description: '1928年福建最早的农民武装暴动，揭开闽西土地革命序幕'
    }
];

// 初始化地图
document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('revolution-map').setView([25.5, 117.5], 7);
    
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
            
            // 加载福建地图GeoJSON并高亮显示
            fetch('fujian.json')
                .then(response => response.json())
                .then(fujianData => {
                    // 绘制福建省轮廓
                    L.geoJSON(fujianData, {
                        style: {
                            color: '#FF0000',
                            weight: 3,
                            fillColor: '#9A1F1A',
                            fillOpacity: 0.3,
                            dashArray: ''
                        }
                    }).addTo(map);

                    // 绘制地级市边界
                    L.geoJSON(fujianData, {
                        style: {
                            color: '#FF6B6B',
                            weight: 1,
                            fillColor: 'transparent',
                            dashArray: '5,5'
                        }
                    }).addTo(map);
                    
                    // 添加革命事件标记
                    addRevolutionMarkers(map);
                });
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
                'yongding': '#FFD700', // 金色
                'gutian': '#FFA500',   // 橙色
                'minxi': '#32CD32',    // 绿色
                'minzhong': '#FF8C00',  // 深橙色
                'houtian': '#FFD700'   // 金色
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
        
        // 获取地点名称
        function getLocationName(id) {
            const locations = {
                'yongding': '龙岩永定',
                'gutian': '龙岩上杭',
                'minxi': '闽西地区',
                'minzhong': '莆田福清',
                'houtian': '龙岩后田'
            };
            return locations[id] || '';
        }

        // 创建点击图标
        function createActiveIcon() {
            const zoom = map.getZoom();
            const size = Math.max(25, 35 * Math.pow(1.2, zoom - 5));
            const colors = {
                'yongding': '#FFD700',
                'gutian': '#FFA500',
                'minxi': '#32CD32',
                'minzhong': '#FF8C00',
                'houtian': '#FFD700'
            };
            return L.divIcon({
                html: `<i class="fas fa-${event.icon}" style="color:${colors[event.id]};font-size:${size}px;text-shadow:0 0 12px rgba(255,255,255,0.8);"></i>`,
                className: 'custom-marker-active',
                iconSize: [size, size]
            });
        }

        // 绑定弹出窗口
        let popupContent = `
            <div class="event-card">
                <h3>${event.name}</h3>
                <i class="fas fa-${event.icon} fa-2x" style="color:${event.id === 'yongding' ? '#FFD700' : event.id === 'gutian' ? '#FFA500' : event.id === 'minxi' ? '#32CD32' : event.id === 'minzhong' ? '#FF8C00' : '#FFD700'}"></i>
                <p class="event-description">${event.description}</p>
                <div class="d-flex justify-content-between mt-3">
                    <span class="location-hint">
                        <i class="fas fa-map-marker-alt"></i> ${getLocationName(event.id)}
                    </span>
                    <button class="explore-btn" onclick="window.location.href='events/${event.id}.html'">
                        <i class="fas fa-arrow-right"></i> 详情
                    </button>
                </div>
            </div>`;
            
        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
        });

        // 添加点击效果
        marker.on('click', function() {
            this.openPopup();
            this.setIcon(createActiveIcon());
        });
        
        // 点击空白处关闭弹窗
        map.on('click', function() {
            marker.setIcon(createDynamicIcon());
            map.closePopup();
        });
    });
}
