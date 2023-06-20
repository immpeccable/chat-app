const { UserModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/find-possible-friends", validateJWT, async (req, res) => {
    const { username } = req.query;
    console.log("find possible usernameeeeee: ", username);
    try {
      if (!username) {
        res.status(404).json({
          message: "Invalid input.",
        });
        return;
      }
      const users = await UserModel.find({
        $and: [
          { username: { $regex: username } },
          { username: { $ne: req.user.username } },
          { username: { $not: { $in: req.user.friends } } },
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
