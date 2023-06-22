const {
  UserModel,
  ChatroomModel,
  MessageModel,
} = require("../../models/index.js");
const { validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/chatrooms-for-user", validateJWT, async (req, res) => {
    try {
      const loggedUser = await UserModel.findOne({
        username: req.user.username,
      });

      const chatroomIDS = loggedUser.chatrooms;

      const promises = chatroomIDS.map(async (cid) => {
        const chr = await ChatroomModel.findById(cid);
        return chr;
      });

      const chatrooms = await Promise.all(promises);

      res.status(200).json({
        chatrooms: chatrooms,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
