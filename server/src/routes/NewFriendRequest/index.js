const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/new-friend-request", validateJWT, async (req, res) => {
    const { to } = req.body;
    try {
      const friendRequest = new FriendRequestModel({
        from: req.user.username,
        to: to.username,
      });
      const isValidRequest = await friendRequest.validateUniqueness();
      if (isValidRequest) {
        const result = await friendRequest.save();
        return res.status(200).json({
          message: `Request saved successfully`,
        });
      } else {
        return res.status(412).json({
          message: "Request already exists",
        });
      }
    } catch (err) {
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
