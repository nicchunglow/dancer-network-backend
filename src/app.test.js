const express = require("express");
const app = require("../src/app");
const mongoose = require("mongoose");
const request = require("supertest");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("/", () => {
  it("should contain the home directory", async () => {
    const expectedDirectory = {
      "0": "GET   /events",
      "1": "GET   /events/:id",
      "2": "POST /events/create",
      "3": "PATCH   /events/:id",
      "4": "DELETE    /events/:id",
      "5": "POST /users/register",
      "6": "POST /users/login",
      "7": "GET /users/:username",
      "8": "PATCH /users/:username",
      "9": "DELETE /user/:username"
    };
    const { body: response } = await request(app).get("/");
    expect(response).toEqual(expectedDirectory);
  });
});
