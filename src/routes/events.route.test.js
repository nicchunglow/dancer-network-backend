const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const events = require("../models/events.model");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("Events", () => {
  it("should pass the test", () => {
    expect(1).toBe(1);
  });
  // it("should retrieve all events in the db", async () =>
  // const {body : response} = request(app)
  // )
});
