import mongoose from "mongoose"
import config from './../config/index'
/**
 * 连接
 */
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
// sudo docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Loveyou," -p 1433:1433 --name sql1 -d mcr.microsoft.com/mssql/server:2017-latest
/**
 * 连接成功
 */
mongoose.connection.on("connected", function() {
  console.log("Mongoose connection open to " + config.DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on("error", function(err) {
  console.log("Mongoose connection error: " + err);
});

/**
 * 连接断开
 */
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose connection disconnected");
});

module.exports = mongoose;
