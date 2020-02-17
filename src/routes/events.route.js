const express = require("express");
const router = express.Router();
const eventCreatorModel = require("../models/events.model");
const wrapAsync = require("../utils/wrapAsync");

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
  const event = await eventCreatorModel.find();
  res.status(200).send(event);
};

const createEvent = async (req, res) => {
  const event = new eventCreatorModel(req.body);
  await eventCreatorModel.init();
  const newEvent = await event.save();
  res.status(201).send(newEvent);
};

const editSingleEvent = async (req, res) => {
  const eventId = String(req.params.id);
  const newEvent = req.body;
  const foundEvent = await eventCreatorModel.findOneAndUpdate(
    { id: eventId },
    newEvent,
    { new: true }
  );
  res.status(201).send(foundEvent);
};

const deleteSingleEvent = async (req, res) => {
  const eventId = String(req.params.id);
  const deletedEvent = await eventCreatorModel.findOneAndDelete({
    id: eventId
  });
  res.status(201).send(deletedEvent);
};

router.get("/", wrapAsync(getAllEvents));
router.get("/:id", wrapAsync(getSingleEvent));
router.post("/create", requireJsonContent, wrapAsync(createEvent));
router.patch("/:id", wrapAsync(editSingleEvent));
router.delete("/:id", wrapAsync(deleteSingleEvent));

router.use((err,req, use, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router