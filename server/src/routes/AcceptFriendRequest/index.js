const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/accept-friend-request", validateJWT, async (req, res) => {
    try {
      const {
        from: fromUsername,
        to: toUsername,
        _id: requestId,
      } = req.body.request;
      if (!fromUsername || !toUsername) return res.sendStatus(404);

      if (toUsername != req.user.username) {
        return res.sendStatus(401).json({
          message: "You are unathorized to do that.",
        });
      }

      const from = await UserModel.findOne({
        username: fromUsername,
      });
      const to = await UserModel.findOne({
        username: toUsername,
      });

      await FriendRequestModel.findOneAndRemove({
        _id: requestId,
      });

      from.friends.push(to._id);
      to.friends.push(from._id);

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
