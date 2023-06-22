const {
  UserModel,
  ChatroomModel,
  MessageModel,
} = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/new-chatroom", validateJWT, async (req, res) => {
    console.log("entred new chatroom");
    const { participants, groupName } = req.body;
    const owner = await UserModel.findOne({
      username: req.user.username,
    });

    const participantIDs = [];
    const participantsWithOwner = [...participants, owner];

    participantsWithOwner.forEach((participant) =>
      participantIDs.push(participant._id.toString())
    );

    const chatroom = new ChatroomModel({
      owner: owner._id,
      participants: participantIDs,
      name: groupName,
      authorized_participants: [owner._id],
    });

    participantIDs.forEach(async (uid) => {
      const user = await UserModel.findById(uid);
      user.chatrooms.push(chatroom._id);
      console.log("user after edited: ", user);
      await user.save();
    });

    await chatroom.save();

    res.status(200).json({
      message: "Chatroom successfully created.",
    });

    try {
    } catch (err) {
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
