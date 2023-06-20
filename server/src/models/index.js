const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

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

const FriendRequestSchema = new Schema({
  from: { type: String },
  to: { type: String },
});

FriendRequestSchema.methods.validateUniqueness = async function () {
  const request1 = FriendRequestModel.find({
    from: this.to,
    to: this.from,
  });
  const request2 = FriendRequestModel.find({
    from: this.from,
    to: this.to,
  });

  return !(request1 || request2);
};

const UserModel = mongoose.model("User", UserSchema);
const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);

module.exports = {
  UserModel,
  FriendRequestModel,
};
