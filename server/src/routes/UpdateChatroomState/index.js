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

      for (let chatroom in user.chatrooms) {
        if (chatroom._id == chatroom_id) {
          chatroom.last_message_count = last_message_count;
          chatroom.last_message_content = last_message_content;
          chatroom.last_message_from = last_message_from;
          break;
        }
      }

      await user.save();

      res.status(200).json({
        message: "Chatroom state successfully updated.",
      });
    } catch (err) {
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
