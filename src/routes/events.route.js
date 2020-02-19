const express = require("express");
const router = express.Router();
const eventCreatorModel = require("../models/events.model");
const wrapAsync = require("../utils/wrapAsync");
const { protectRoute } = require("../middleware/auth");
const uuidv4 = require("uuid/v4");

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("File is not in application/json!");
  } else {
    next();
  }
};
const getAllEvents = async (req, res) => {
  const events = await eventCreatorModel.find();
  res.status(200).send(events);
};

const getSingleEvent = async (req, res) => {
  const event = await eventCreatorModel.findOne(
    { eventId: req.params.id },
    "-_id -__v"
  );
  res.status(200).send(event);
};

const createEvent = async (req, res) => {
  const event = new eventCreatorModel(req.body);
  await eventCreatorModel.init();
  event.eventOwner = req.user.username;
  event.eventId = uuidv4();
  const newEvent = await event.save();
  res.status(201).send(newEvent);
};

const editSingleEvent = async (req, res, next) => {
  const newEvent = req.body;
  const eventOwnerCheck = await eventCreatorModel.findOne({
    eventId: req.params.id
  });
  if (eventOwnerCheck.eventOwner != req.user.username) {
    const err = new Error("You cannot edit as this is not your post.");
    err.statusCode = 403;
    next(err);
  }
  const updatedEvent = await eventCreatorModel.findOneAndUpdate(
    { eventId: req.params.id },
    newEvent,
    { new: true }
  );
  res.status(200).send(updatedEvent);
};

const deleteSingleEvent = async (req, res) => {
  const eventOwnerCheck = await eventCreatorModel.findOne({
    eventId: req.params.id
  });
  if (eventOwnerCheck.eventOwner != req.user.username) {
    const err = new Error("You cannot delete THIS SHIT.");
    err.statusCode = 403;
    next(err);
  }
  const deletedEvent = await eventCreatorModel.findOneAndDelete({
    eventId: req.params.id
  });
  res.status(201).send(deletedEvent);
};

router.get("/", wrapAsync(getAllEvents));
router.get("/:id", wrapAsync(getSingleEvent));
router.post(
  "/create",
  requireJsonContent,
  protectRoute,
  wrapAsync(createEvent)
);
router.patch("/:id", protectRoute, wrapAsync(editSingleEvent));
router.delete("/:id", protectRoute, wrapAsync(deleteSingleEvent));

router.use((err, req, use, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
