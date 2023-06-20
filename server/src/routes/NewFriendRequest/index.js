const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/new-friend-request", validateJWT, async (req, res) => {
    const { from, to } = req.body;
    try {
      const friendRequest = new FriendRequestModel({
        from: from,
        to: to,
      });

      if (friendRequest.validateUniqueness()) {
        const result = await friendRequest.save();
        console.log(result);
        return res.status(200).json({
          message: `Request saved successfully`,
        });
      } else {
        return res.status(402).json({
          message: "Request already exists",
        });
      }
    } catch (err) {
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
