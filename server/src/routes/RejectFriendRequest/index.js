const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/reject-friend-request", validateJWT, async (req, res) => {
    try {
      const { request } = req.body;
      if (!request) return res.sendStatus(404);
      if (request.to != req.user.username) {
        return res.sendStatus(401).json({
          message: "You are unathorized to do that.",
        });
      }
      // const from = await UserModel.findOne({
      //   username: request.from,
      // });
      // const to = await UserModel.findOne({
      //   username: request.to,
      // });
      await FriendRequestModel.findOneAndRemove({
        _id: request._id,
      });
      res.status(200).json({
        message: "Friend request is rejected successfully",
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
