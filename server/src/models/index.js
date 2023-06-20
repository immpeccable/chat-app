const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const SALT_ROUNDS = 10;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 50, unique: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Not valid email address",
      isAsync: false,
    },
    unique: true,
  },
  password: { type: String, required: true },
  friends: { type: [], default: [], required: false },
});

UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
};
