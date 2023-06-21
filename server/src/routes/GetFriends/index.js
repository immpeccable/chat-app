const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/friends", validateJWT, async (req, res) => {
    const { searchUsername } = req.query;

    try {
      const loggedUser = await UserModel.findOne({
        username: req.user.username,
      });

      const friends = await UserModel.find({
        username: { $regex: searchUsername },
        _id: { $in: loggedUser.friends },
      });
      res.status(200).json({
        friends: friends,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
