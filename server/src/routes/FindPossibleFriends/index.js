const { UserModel, FriendRequestModel } = require("../../models/index.js");
const { validateJWT } = require("../../validators/index.js");

const { s3Client } = require("../../aws/index.js");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = process.env.AWS_BUCKET_NAME;

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

      const users_dto_promises = users.map(async (user) => {
        const user_dto = Object.assign({}, user)._doc;
        if (user_dto.profile_image) {
          user_dto.profileImageUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: bucketName,
              Key: user_dto.profile_image,
            }),
            { expiresIn: 360000 } // 60 seconds
          );
        }
        return user_dto;
      });

      const users_dto = await Promise.all(users_dto_promises);

      res.json({
        users: users_dto,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
