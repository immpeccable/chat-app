const { UserModel } = require("../../models/index.js");

const multer = require("multer");
const sharp = require("sharp");
const crypto = require("crypto");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

function endpoint(app) {
  app.post("/new-user", upload.single("profileImage"), async (req, res) => {
    const { username, email, password } = req.body;
    const file = req.file;
    try {

      const newUser = new UserModel({
        username: username,
        password: password,
        email: email,
        friends: [],
      });

      if (file) {
        const fileBuffer = await sharp(file.buffer)
          .resize({ height: 1920, width: 1080, fit: "contain" })
          .toBuffer();

        // Configure the upload details to send to S3
        const fileName = generateFileName();
        const uploadParams = {
          Bucket: bucketName,
          Body: fileBuffer,
          Key: fileName,
          ContentType: file.mimetype,
        };

        // Send the upload to S3
        await s3Client.send(new PutObjectCommand(uploadParams));

        newUser.profile_image = fileName;
      }

      await newUser.setPassword(password);
      newUser
        .save()
        .then(() => {
          return res.status(200).json({
            message: "User created successfully",
          });
        })
        .catch((error) => {
          console.error("Error saving user:", error);
          return res.status(412).json({
            message: "Username or gmail already exists. Please try again.",
          });
        });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
