const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userModel = require("../models/users.model");

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
        username: "totoro@gmail.com",
        password: "chocoPie123",
        firstName: "Nic",
        lastName: "Chung",
        stageName: "Jay Chou"
      },
      {
        username: "mono@gmail.com",
        password: "chocoPie123",
        firstName: "Pororo",
        lastName: "Chung",
        stageName: "Ah Du"
      }
    ];
    await userModel.create(userData);
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  describe("/users/register", () => {
    it("POST should add one user", async () => {
      const expectedUserData = {
        username: "mrliew@gmail.com",
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
        username: "totoro@gmail.com",
        password: "chocoPie123"
      };
      const { body: users } = await request(app)
        .post("/users/login")
        .send(expectedUserData)
        .expect(201);
        expect(users).toBe("You are now logged in!")
    });
  });
  // describe("/users/:username", () => {
  //   it("GET shoulder respond with user details when correct user logs in", async () => {
  //     const expectedUserData = {
  //       username: "totoro@gmail.com",
  //     };
  //     const { body: users } = await request(app)
  //       .post(`/users/${expectedUserData}`)
  //       .send(expectedUserData)
  //       .expect(200);
        
  //   });
  // });

  
});
