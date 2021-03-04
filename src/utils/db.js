require("dotenv").config();
const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true, // prevent deprecation warnings
  useUnifiedTopology: true,
  useFindAndModify: false, // For find one and update
  useCreateIndex: true, // for creating index with unique
};

const dbName = "DancerNetwork";
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/" + dbName;

const connectDB = async () => {
  mongoose.connect(dbUrl, mongoOptions);
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("CONNECT LIAO. WHAT YOU WANT.");
});

module.exports = connectDB;
