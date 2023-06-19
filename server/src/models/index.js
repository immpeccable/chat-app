const validator = require("validator");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 50 },
  email: {
    type: String,
    required: true,
    validator: {
      validator: validator.isEmail,
      message: "Not valid email address",
      isAsync: false,
    },
    unique: true,
  },
  password: { type: String, required: true },
  friends: { type: [], default: [], required: false },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
};
