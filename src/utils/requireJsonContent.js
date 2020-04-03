const express = require("express")

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    const err = new Error("File is not in application/json!")
    err.statusCode = 400;
    next(err)
  } else {
    next();
  }
};

module.exports = requireJsonContent