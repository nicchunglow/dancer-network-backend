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
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      },
      {
        username: "monopolo",
        userId: "2",
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
    it("POST should add one user with password of one lowercase, one uppercase and numbers", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
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
    it("POST should fail with password of no uppercase and numbers", async () => {
      const expectedUserData = {
        username: "mrliew",
        userId: "3",
        password: "chocopie123",
        firstName: "De",
        lastName: "Hua",
        stageName: "SuperStar"
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
    });
    it("POST should not add user if username is uppercase", async () => {
      const expectedUserData = {
        username: "Tororo12",
        userId: "3",
        password: "chocoPie123",
        firstName: "De",
        lastName: "Hua",
        stageName: "SuperStar"
      };
      const { body: error } = await request(app)
        .post("/users/register")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual(
        expect.stringContaining("createUsers validation failed")
      );
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
      console.log(users);
    });
    it("POST user should not login if the username or password is wrong", async () => {
      const expectedUserData = {
        username: "totoro",
        password: "chocoie123"
      };
      const { body: error } = await request(app)
        .post("/users/login")
        .send(expectedUserData)
        .expect(400);
      expect(error.error).toEqual("Login failed");
    });
  });

  describe("/users/:username", () => {
    it("GET should respond with user details with the right JWT token", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({
        username: expectedUserData.username,
        userId: "1"
      });
      const { body: users } = await request(app)
        .get(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(200);
      expect(users.username).toBe(expectedUserData.username);
      expect(users.password).not.toBe("chocoPie123");
    });

    it("GET should not get their details when JWT and params does not match", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({
        username: "totochan",
        userId: "1"
      });
      const { body: error } = await request(app)
        .get(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error.error).toEqual("Incorrect user!");
    });
    it("GET should not be authorized if there is no JWT", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({ username: expectedUserData.username });
      const { body: error } = await request(app)
        .get(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .expect(401);
      expect(error.error).toEqual("You are not authorized.");
    });

    it("PATCH edit user details after login", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
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

    it("PATCH should not edit if the user is unauthorized", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "oppo",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({ username: "toporo" });
      const { body: error } = await request(app)
        .patch(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error.error).toEqual("Incorrect user!");
    });

    it("DELETE user when the parem and input match", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({
        username: expectedUserData.username,
        userId: "1"
      });
      const { body: users } = await request(app)
        .delete(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(201);
      expect(users.username).toBe(expectedUserData.username);
    });

    it("DELETE user will not delete when the username does not match", async () => {
      const expectedUserData = {
        username: "totoro",
        userId: "1",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      };
      jwt.verify.mockReturnValueOnce({
        username: "Toporo",
        userId: "1"
      });
      const { body: error } = await request(app)
        .delete(`/users/${expectedUserData.username}`)
        .send(expectedUserData)
        .set("Cookie", "token=valid-token")
        .expect(403);
      expect(error.error).toEqual("You forbidden. Back off!");
    });
  });
});
