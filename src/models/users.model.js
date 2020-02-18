const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: String,
  lastName: String,
  stageName: String
});

userSchema.pre("save", async function(next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next()
});

const userCreatorModel = mongoose.model("createUsers", userSchema);

module.exports = userCreatorModel;
