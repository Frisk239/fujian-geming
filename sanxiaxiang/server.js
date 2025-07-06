const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API路由
app.get('/api/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.json'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
