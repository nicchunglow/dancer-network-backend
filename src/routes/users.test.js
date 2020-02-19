const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userModel = require("../models/users.model");
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
    const userData = [
      {
        username: "totoro",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      },
      {
        username: "mono",
        password: "chocoPie123",
        firstName: "Pororo",
        lastName: "Chung",
        stageName: "Ah Du"
      }
    ];
    await userModel.create(userData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await userModel.deleteMany();
  });

  describe("/users/register", () => {
    it("POST should add one user", async () => {
      const expectedUserData = {
        username: "mrliew",
        password: "chocoPie123",
        firstName: "De",
        lastName: "Hua",
        stageName: "SuperStar"
      };
      const { body: users } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(201);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.password).not.toBe("chocoPie123");
    });
  });
  describe("/users/login", () => {
    it("POST user should be able to login", async () => {
      const expectedUserData = {
        username: "totoro",
        password: "chocoPie123"
      };
      const { body: users } = await request(app)
        .post("/users/login")
        .send(expectedUserData)
        .expect(201);
      expect(users).toBe("You are now logged in!");
    });
  });
  describe("/users/:username", () => {
    it("GET shoulder respond with user details when correct user logs in", async () => {
      const expectedUserData = {
        username: "totoro",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({ username: expectedUserData.username });
      const { body: users } = await request(app)
        .get(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(200);
      console.log(users);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.password).not.toBe("chocoPie123");
    });
    it("PATCH edit user details after login", async () => {
      const expectedUserData = {
        username: "totoro",
        password: "chocoPie123",
        firstName: "oppo",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({ username: expectedUserData.username });
      const { body: users } = await request(app)
        .patch(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(200);
      expect(users).toMatchObject(expectedUserData);
    });
    it("DELETE user when the parem and input match", async () => {
      const expectedUserData = {
        username: "totoro",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({ username: expectedUserData.username });
      const { body: users } = await request(app)
        .delete(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(201);
      expect(users).not.toEqual(expectedUserData.password);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.stageName).toBe(expectedUserData.stageName);
    });
  });
});
