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
  locationCoordinates: coordinateSchema,
  description: String,
  danceStyle: String, 
  eventOwner : String
});

const eventCreatorModel = mongoose.model("createEvent", eventSchema);

module.exports = eventCreatorModel;
