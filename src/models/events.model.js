const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = Schema({
  eventId: {
    type: Number,
    required: true,
    minlength: 1,
    unique: true
  },
  eventName: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },

  eventStartDate: Date,
  eventEndDate: Date,
  location: {
    type: String
  },
  locationLat: Number,
  locationLong: Number,
  description: String,
  dancestyle: String
});

const eventCreatorModel = mongoose.model("createEvent", eventSchema);

module.exports = eventCreatorModel;
