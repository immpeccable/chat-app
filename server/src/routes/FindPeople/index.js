const { UserModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/find-people", validateJWT, async (req, res) => {
    const { username } = req.query;
    try {
      if (!username) {
        return res.sendStatus(401).json({
          message: "Invalid input.",
        });
      }
      const users = await UserModel.find({
        username: { $regex: username },
      });

      console.log(users);
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
