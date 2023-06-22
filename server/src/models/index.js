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
  chatrooms: { type: [], default: [], required: false },
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
  console.log("hello validating");
  const request1 = await FriendRequestModel.find({
    from: this.to,
    to: this.from,
  });
  const request2 = await FriendRequestModel.find({
    from: this.from,
    to: this.to,
  });
  console.log("herea re the requests: ", request1, request2);
  return !request1.length && !request2.length;
};

const ChatroomSchema = new Schema({
  owner: { type: String, required: true, maxLength: 50 },
  participants: { type: [], default: [], required: true },
  authorized_participants: { type: [], default: [], required: true },
  name: { type: String, required: true, maxLength: 100 },
  messages: { type: [], default: [], required: false },
});

const MessageSchema = new Schema({
  from: { type: String, required: true, maxLength: 50 },
  content: { type: String, required: true },
});

MessageSchema.set("timestamps", true);
ChatroomSchema.set("timestamps", true);
UserSchema.set("timestamps", true);
FriendRequestSchema.set("timestamps", true);

const MessageModel = mongoose.model("Message", MessageSchema);
const UserModel = mongoose.model("User", UserSchema);
const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);
const ChatroomModel = mongoose.model("ChatRoom", ChatroomSchema);

module.exports = {
  UserModel,
  FriendRequestModel,
  MessageModel,
  ChatroomModel,
};
