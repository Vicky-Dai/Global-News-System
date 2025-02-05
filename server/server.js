// server.js 后端入口文件  node server.js 启动后端
const express = require('express');
const { connectDB } = require('./config/db');

//我自己写的各种 routes 记得删掉这里注释
const newsRoutes = require('./routes/newsRoutes');


// create express app stored in app instance
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS 如果前端后端在不同的端口运行
const cors = require('cors');
app.use(cors());
app.listen()

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Example route
// app.get('/', (req, res) => {
//   res.send('Server is running');
// });
app.use('/api/newsRoutes', newsRoutes); //grab all the routes from newsRoutes.js and use them in this app instance



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/* 这个是后端的入口，通过config的db.js文件设置，和数据库MongoDB连接，后端和数据库的连接CRUD靠mongoose(models文件夹下的不同类型的数据模板）*/