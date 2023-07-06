const {
  UserModel,
  ChatroomModel,
  MessageModel,
} = require("../../models/index.js");
const { validateJWT } = require("../../validators/index.js");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function endpoint(app) {
  app.get("/chatroom-by-id", validateJWT, async (req, res) => {
    try {
      const { chatroom_id } = req.query;
      console.log(chatroom_id);
      const chr = await ChatroomModel.findById(chatroom_id);

      const chatroom = Object.assign({}, chr)._doc;

      const promises = chatroom.messages.map(async (message, i) => {
        if (message.from_profile_image) {
          console.log("inside some shit");
          message.from_profile_image_url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: bucketName,
              Key: message.from_profile_image,
            }),
            { expiresIn: 360000 } // 60 seconds
          );
        }
        return message;
      });

      await Promise.all(promises);

      console.log("chr by id: ", chatroom);
      res.status(200).json({
        chatroom: chatroom,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
