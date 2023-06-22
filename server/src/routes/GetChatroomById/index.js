const {
  UserModel,
  ChatroomModel,
  MessageModel,
} = require("../../models/index.js");
const { validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/chatroom-by-id", validateJWT, async (req, res) => {
    try {
      const { chatroom_id } = req.query;
      console.log(chatroom_id);
      const chr = await ChatroomModel.findById(chatroom_id);

      res.status(200).json({
        chatroom: chr,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
