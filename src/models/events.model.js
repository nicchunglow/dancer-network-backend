const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkValidDate = function (v) {
  return /^(20| 21)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(v);
};

const coordinateSchema = {
  lat: {
    type: Number,
    min: -90,
    max: 90,
  },
  lng: {
    type: Number,
    min: -180,
    max: 180,
  },
};
const eventSchema = Schema({
  eventId: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    immutable: true,
  },
  eventName: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },

  eventStartDate: {
    type: String,
    validate: {
      validator: checkValidDate,
    },
  },
  eventEndDate: {
    type: String,
    validate: {
      validator: checkValidDate,
    },
  },
  address: {
    type: String,
  },
  coordinates: coordinateSchema,
  description: String,

  eventSummary: {
    type: String,
    maxlength: 200,
  },
  danceStyle: String,
  eventOwner: {
    type: String,
  },
  eventOwnerId: {
    type: String,
    immutable: true,
  },
  eventImage: {
    type: String,
    data: Buffer,
  },
});

const eventCreatorModel = mongoose.model("createEvent", eventSchema);

module.exports = eventCreatorModel;
