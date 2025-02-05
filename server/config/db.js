/* 起到跟mongoDB连接的作用 */
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Vicky-Dai:Ji4z3zESqes5gap6@mars.nr9dh.mongodb.net/?retryWrites=true&w=majority&appName=Mars";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 定义 connectDB 函数
const connectDB = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // 连接失败时退出进程
  }
};

// 导出 connectDB 函数
module.exports = { connectDB };
