# Dancer-network backend

## Table of Contents

- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Setup](#Setup)
- [Environment Variables](#Environment-Variables)
- [Availble Scripts](#Available-Scripts)
- [Availblve Routes](#Available-Routes)

## Introduction

In the dance community, events are disorganised as a whole, causing dancers hard to find out what are the different events they are able to attend. Hence, this app aims to bridge that gap by collating all the events into a single platform. eventually linking various event from other countries as well.

Link to Frontend: https://github.com/nicchunglow/dancer-network

## Technologies

- JavaScript ES6
- MongoDB
- Express: 4.17.1
- Mongoose: 5.9.1
- bcryptjs: 2.4.3
- cookie-parser: 1.4.4
- cors: 2.8.5
- dotenv: 8.2.0
- jsonwebtoken: 8.5.1
- uuid: 3.4.0

## Setup

To run this project, git clone and install it locally using npm:

```
$ cd ../
$ git clone https://github.com/nicchunglow/dancer-network-backend.git
$ npm install
$ npm start
```

## Environment Variables

- JWT_SECRET_KEY: secret key to use with JsonWebToken

## Available Scripts

In the project directory, you can run:

```
npm start // runs the app in development mode
npm rund start:dev // runs the app in nodemon
npm test // runs test runner without watch mode
npm run testc // runs test coverage in interactive watch mode
```

## Available Routes

```
  "0": "GET   /events",
  "1": "GET   /events/published/:id",
  "2": "POST /events/create",
  "3": "PATCH   /events/published/:id",
  "4": "DELETE    /events/published/:id",
  "5": "POST /users/register",
  "6": "POST /users/login",
  "7": "GET /users/:username",
  "8": "PATCH /users/:username",
  "9": "DELETE /user/:username"
```