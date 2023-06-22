const { UserModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/logged-user", validateJWT, async (req, res) => {
    try {
      return res.status(200).json({
        user: req.user,
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
