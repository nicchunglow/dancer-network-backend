const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const eventsModel = require("../models/events.model");
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

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
        eventId: "1",
        eventName: "FINDING MEMO ",
        eventStartDate: "2020-10-26",
        eventEndDate: "2020-10-27",
        location: "Aliwal",
        description: "blah blah blah",
        eventSummary: "Not lorem",
        danceStyle: "Hip Hop",
        eventOwner: "Totoro",
        eventOwnerId: "10"
      },
      {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: "3",
        eventName: "FINDING TIKO 3 ",
        eventStartDate: "2020-10-10",
        eventEndDate: "2020-10-20",
        location: "Aliwal",
        description: "blah blah blah",
        eventSummary: "Not ipsem",
        danceStyle: "Waacking",
        eventOwner: "Pororo",
        eventOwnerId: "12"
      }
    ];
    await eventsModel.create(eventData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await eventsModel.deleteMany();
  });

  it("should pass the test", () => {
    expect(1).toBe(1);
  });

  describe("/events", () => {
    it("GET should retrieve all events but with the following key:value pairs: eventName eventStartDate eventEndDate Location locationCoordiantes danceStyle eventSummary", async () => {
      const mockEventData = [
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventName: "FINDING MEMO ",
          eventStartDate: "2020-10-26",
          eventEndDate: "2020-10-27",
          location: "Aliwal"
        },
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventName: "FINDING TIKO 3 ",
          eventStartDate: "2020-10-10",
          eventEndDate: "2020-10-20",
          location: "Aliwal"
        }
      ];
      const { body: events } = await request(app)
        .get("/events")
        .expect(200);
      expect(events).toMatchObject(mockEventData);
    });

    it("GET should not get other details from the schema", async () => {
      const mockEventData = [
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventId: "1",
          eventName: "FINDING MEMO ",
          eventStartDate: "2020-10-26",
          eventEndDate: "2020-10-27",
          location: "Aliwal",
          description: "blah blah blah",
          eventSummary: "Not lorem",
          danceStyle: "Hip Hop",
          eventOwner: "Totoro",
          eventOwnerId: "10"
        },
        {
          locationCoordinates: {
            lat: 10,
            long: 90.55
          },
          eventId: "3",
          eventName: "FINDING TIKO 3 ",
          eventStartDate: "2020-10-10",
          eventEndDate: "2020-10-20",
          location: "Aliwal",
          description: "blah blah blah",
          eventSummary: "Not ipsem",
          danceStyle: "Waacking",
          eventOwner: "Pororo",
          eventOwnerId: "12"
        }
      ];
      const { body: events } = await request(app)
        .get("/events")
        .expect(200);
      expect(events).not.toMatchObject(mockEventData);
    });
    it("testing for 500 error", async () => {
      const originalEventModel = eventsModel.find;
      eventsModel.find = jest.fn();
      eventsModel.find.mockImplementationOnce(() => {
        const err = new Error();
        throw err;
      });
      const { body: error } = await request(app)
        .get("/events")
        .expect(500);
      expect(error).toEqual({ error: "internal server error" });
      eventsModel.find = originalEventModel;
    });
    it("testing requireJsonContent error", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "10" });
      const failJson = "fail me now"
      const { body: error } = await request(app)
        .post("/events/create")
        .send(failJson)
        .set("Cookie", "token=valid-token")
        .expect(400);
        expect(error.error).toEqual("File is not in application/json!")
    });
  });

  describe("/events/create", () => {
    it("POST should post one event", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro" });
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventName: "FINDING MMORPG",
        eventStartDate: "2020-10-10",
        eventEndDate: "2020-10-20",
        location: "Aliwal",
        description: "blah blah blah",
        eventOwner: "Totoro"
      };
      const { body: events } = await request(app)
        .post("/events/create")
        .send(mockEventData)
        .set("Cookie", "token=valid-token")
        .expect(201);
      expect(events).toMatchObject(mockEventData);
    });
    it("POST should get 'ValidationError' if date are of wrong values", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "10" });
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventName: "FINDING MMORPG",
        eventStartDate: "20201-10-10",
        eventEndDate: "20210-10-20",
        location: "Aliwal",
        description: "blah blah blah",
        eventOwner: "Totoro",
        eventOwnerId: "10"
      };
      const { body: error } = await request(app)
        .post("/events/create")
        .send(mockEventData)
        .set("Cookie", "token=valid-token")
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createEvent validation failed")
      );
    });
  });
  describe("/events/:id", () => {
    it("GET should retrieve one event only from the db", async () => {
      const mockEventData = {
        locationCoordinates: {
          lat: 10,
          long: 90.55
        },
        eventId: "1",
        eventName: "FINDING MEMO "
      };
      const { body: events } = await request(app)
        .get("/events/1")
        .expect(200);
      expect(events).toMatchObject(mockEventData);
    });

    it("PATCH should edit one event the name", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "10" });
      const mockEventData = {
        eventName: "FINDING PORORO",
        eventId: "1",
        eventOwner: "Totoro",
        eventOwnerId: "10"
      };
      const { body: events } = await request(app)
        .patch("/events/1")
        .send(mockEventData)
        .set("Cookie", "token=valid-token")
        .expect(200);
      expect(events).toMatchObject(mockEventData);
    });

    it("PATCH should not edit if forbidden", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "12312" });
      const mockEventData = {
        eventName: "FINDING PORORO",
        eventId: "1",
        eventOwner: "Totoro",
        eventOwnerId: "10"
      };
      const { body: error } = await request(app)
        .patch("/events/1")
        .send(mockEventData)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error.error).toEqual("You cannot edit as this is not your post.");
    });
    it("DELETE should DELETE one event", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "10" });
      const mockEventData = {
        eventName: "FINDING MEMO ",
        eventOwner: "Totoro",
        eventId: "1",
        eventOwnerId: "10"
      };
      const { body: events } = await request(app)
        .delete("/events/1")
        .send(mockEventData)
        .set("cookie", "token=valid-token")
        .expect(201);
      expect(events).toMatchObject(mockEventData);
    });
    it("DELETE should not delete if forbidden", async () => {
      jwt.verify.mockReturnValueOnce({ username: "Totoro", userId: "12312" });
      const mockEventData = {
        eventName: "FINDING PORORO",
        eventId: "1",
        eventOwner: "Totoro",
        eventOwnerId: "10"
      };
      const { body: error } = await request(app)
        .delete("/events/1")
        .send(mockEventData)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error.error).toEqual("You forbidden. Back off!");
    });
  });
});
