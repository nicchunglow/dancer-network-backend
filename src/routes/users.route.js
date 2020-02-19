const express = require("express");
const router = express.Router();
const usersModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protectRoute } = require("../middleware/auth");
const uuidv4 = require("uuid/v4");

// const requireJsonContent = (req, res, next) => {
//   if (req.headers["content-type"] !== "application/json") {
//     res.status(400).send("File is not in application/json!");
//   } else {
//     next();
//   }
// };

const createJWTToken = (username, stageName) => {
  const payload = { username: username, stageName: stageName };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = oneDay * 7;

const expiryDate = new Date(Date.now() + oneWeek);

router.post("/register", async (req, res, next) => {
  try {
    const user = new usersModel(req.body);
    await usersModel.init();
    user.userId = uuidv4();
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usersModel.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!user || !result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username, user.stageName);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true
    });

    res.status(201).json("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.get("/:username", protectRoute, async (req, res, next) => {
  const INCORRECT_USER_ERR_MSG = "Incorrect user!";
  try {
    if (req.user.username !== req.params.username) {
      throw new Error(INCORRECT_USER_ERR_MSG);
    }
    const user = await usersModel.findOne({ username: req.params.username });
    res.status(200).send(user);
  } catch (err) {
    if (err.message === INCORRECT_USER_ERR_MSG) {
      err.statusCode = 403;
    }
    next(err);
  }
});

router.patch("/:username", async (req, res, next) => {
  try {
    const newUser = req.body;
    const user = await usersModel.findOneAndUpdate(
      { username: req.params.username },
      newUser,
      { new: true }
    );
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

router.delete("/:username", async (req, res, next) => {
  try {
    const userDeleted = await usersModel.findOneAndDelete({
      username: req.params.username
    });
    res.status(201).send(userDeleted);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
