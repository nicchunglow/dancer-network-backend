const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({
    "0": "GET   /events",
    "1": "GET   /events/:id",
    "2": "PATCH   /events/:id",
    "3": "DELETE    /events/:id",
    "4": "POST /events",
    "5": "POST /users/register",
    "6": "POST /users/login",
    "7": "GET /users/:id",
    "8": "PATCH /users/:id"
  });
});

app.use(express.json());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
