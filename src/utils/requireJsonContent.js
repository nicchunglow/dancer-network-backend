const express = require("express")

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("File is not in application/json!");
  } else {
    next();
  }
};

module.exports = requireJsonContent