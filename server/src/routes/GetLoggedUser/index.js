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
  app.get("/logged-user", validateJWT, async (req, res) => {
    let user = Object.assign({}, req.user)._doc;
    try {
      if (user.profile_image) {
        console.log("hello world");
        user.profileImageUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucketName,
            Key: user.profile_image,
          }),
          { expiresIn: 360000 } // 60 seconds
        );
      }

      return res.status(200).json({
        user: user,
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
