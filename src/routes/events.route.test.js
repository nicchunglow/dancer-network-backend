const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const eventsModel = require("../models/events.model");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("Events", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.stop();
  });

  beforeEach(async () => {
    const eventData = [
      {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: 1,
        eventName: "FINDING MEMO "
      },
      {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: 3,
        eventName: "FINDING TIKO 3 "
      }
    ];
    await eventsModel.create(eventData);
  });

  afterEach(async () => {
    await eventsModel.deleteMany();
  });

  it("should pass the test", () => {
    expect(1).toBe(1);
  });

  describe("GET EVENTS", () => {
    it("GET should retrieve all events in the db", async () => {
      const mockEventData = [
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventId: 1,
          eventName: "FINDING MEMO "
        },
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventId: 3,
          eventName: "FINDING TIKO 3 "
        }
      ];
      const { body: events } = await request(app)
        .get("/events")
        .expect(200);
      // console.log(events)
      expect(events).toMatchObject(mockEventData);
    });
    it("GET should retrieve one event only from the db", async () => {
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: 1,
        eventName: "FINDING MEMO "
      };
      const { body: events } = await request(app)
        .get("/events/1")
        .expect(200);
      expect(events).toMatchObject(mockEventData);
    });
  });
  describe("POST", () => {
    it("POST should post one event", async () => {
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: 5,
        eventName: "FINDING MMORPG"
      };
      const { body: events } = await request(app)
        .post("/events/create")
        .send(mockEventData)
        .expect(201);
      expect(events).toMatchObject(mockEventData);
    });
  });
  describe("PATCH", () => {
    it("PATCH should edit one event the name", async () => {
      const mockEventData = {
        eventName: "FINDING PORORO"
      };
      const { body: events } = await request(app)
        .patch("/events/1")
        .send(mockEventData)
        .expect(201);
      expect(events).toMatchObject(mockEventData);
    });
  });
  describe("DELETE", () => {
    it("DELETE should DELETE one event", async () => {
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: 1,
        eventName: "FINDING MEMO "
      };
      const { body: events } = await request(app)
        .delete("/events/1")
        .send(mockEventData)
        .expect(201);
      expect(events).toMatchObject(mockEventData);
    });
  });
});
