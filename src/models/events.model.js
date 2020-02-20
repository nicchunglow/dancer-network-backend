const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coordinateSchema = {
  lat: {
    type: Number,
    min: -90,
    max: 90
  },
  long: {
    type: Number,
    min: -180,
    max: 180
  }
};
const eventSchema = Schema({
  eventId: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    immutable: true
  },
  eventName: {
    type: String,
    required: true,
    minlength: 2,
    unique: true
  },

  eventStartDate: Date,
  eventEndDate: Date,
  location: {
    type: String
  },
  locationCoordinates: coordinateSchema,
  description: String,
  eventSummary: {
    type: String,
    maxlength: 200
  },
  danceStyle: String,
  eventOwner: {
    type: String
  },
  eventOwnerId: {
    type: String,
    immutable: true
  }
});

const eventCreatorModel = mongoose.model("createEvent", eventSchema);

module.exports = eventCreatorModel;
