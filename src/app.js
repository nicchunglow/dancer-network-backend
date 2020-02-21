require("dotenv").config();
const express = require("express");
const app = express();
const eventsRouter = require("../src/routes/events.route");
const usersRouter = require("../src/routes/users.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: [process.env.FRONTEND_URL,"http://localhost:3000", "http://localhost:3001"],
  credentials: true
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use("/events", eventsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send({
    "0": "GET   /events",
    "1": "GET   /events/:id",
    "2": "POST /events/create",
    "3": "PATCH   /events/:id",
    "4": "DELETE    /events/:id",
    "5": "POST /users/register",
    "6": "POST /users/login",
    "7": "GET /users/:username",
    "8": "PATCH /users/:username",
    "9": "DELETE /user/:username"
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  //console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});

module.exports = app;
