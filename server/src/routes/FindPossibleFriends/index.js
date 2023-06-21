const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/find-possible-friends", validateJWT, async (req, res) => {
    const { username } = req.query;

    try {
      if (!username) {
        res.status(404).json({
          message: "Invalid input.",
        });
        return;
      }

      const alreadySentRequests = await FriendRequestModel.find({
        from: req.user.username,
      });
      console.log(alreadySentRequests);
      const friendRequestUsernameList = [];

      alreadySentRequests.forEach((req) => {
        friendRequestUsernameList.push(req.to);
      });

      const users = await UserModel.find({
        $and: [
          { username: { $regex: username } },
          { username: { $ne: req.user.username } },
          { username: { $not: { $in: req.user.friends } } },
          { username: { $not: { $in: friendRequestUsernameList } } },
        ],
      });
      res.json({
        users: users,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
