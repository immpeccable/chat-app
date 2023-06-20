const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/accept-friend-request", validateJWT, async (req, res) => {
    try {
      const { request } = req.body;
      if (!request) return res.sendStatus(404);
      if (request.from != req.user.username) {
        return res.sendStatus(401).json({
          message: "You are unathorized to do that.",
        });
      }

      const from = await UserModel.find({
        username: request.from,
      });
      const to = await UserModel.find({
        username: request.to,
      });
      await UserModel.findOneAndRemove({
        _id: from._id,
      });

      from.friends.push(to);
      to.friends.push(from);

      await from.save();
      await to.save();

      res.status(200).json({
        message: "Friend request is accepted successfully",
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
