const express = require("express");
const app = express();
const eventsRouter = require("../src/routes/events.route");
const usersRouter = require("../src/routes/users.route");

app.get("/", (req, res) => {
  res.send({
    "0": "GET   /events",
    "1": "GET   /events/:id",
    "2": "POST /events/create",
    "3": "PATCH   /events/:id",
    "4": "DELETE    /events/:id",
    "5": "POST /users/register",
    "6": "POST /users/login",
    "7": "GET /users/:id",
    "8": "PATCH /users/:id",
    "9": "DELETE /user/id"
  });
});

app.use(express.json());

app.use("/events", eventsRouter);
app.use("/users", usersRouter);

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
