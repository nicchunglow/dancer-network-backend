const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const checkUsername = function(v) {
  return /^(?=.*[a-z])[a-z\d]{3,}$/.test(v);
};
const checkPassword = function(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
};
const userSchema = Schema({
  userId: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    immutable: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: checkUsername
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: checkPassword
    }
  },
  firstName: String,
  lastName: String,
  stageName: String
});

userSchema.pre("save", async function(next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const userCreatorModel = mongoose.model("createUsers", userSchema);

module.exports = userCreatorModel;
