const {
  UserModel,
  ChatroomModel,
  MessageModel,
} = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/update-chatroom-state", validateJWT, async (req, res) => {
    try {
      const user = req.user;
      const {
        chatroom_id,
        last_message_count,
        last_message_from,
        last_message_content,
      } = req.body;

      console.log("before: ", user.chatrooms);
      const result = user.chatrooms.map((chatroom) => {
        if (chatroom.id.toString() == chatroom_id) {
          chatroom.last_message_count = last_message_count;
          chatroom.last_message_content = last_message_content;
          chatroom.last_message_from = last_message_from;
        }
        return chatroom;
      });

      for (let i = 0; i < user.chatrooms.length; i++) {
        user.chatrooms[i] = result[i];
      }

      await user.save();

      res.status(200).json({
        message: "Chatroom state successfully updated.",
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
