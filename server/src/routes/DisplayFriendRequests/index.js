const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/display-friend-requests", validateJWT, async (req, res) => {
    try {
      const user = req.user;
      const requests = await FriendRequestModel.find({
        to: user.username,
      });
      res.status(200).json({
        requests: requests,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
