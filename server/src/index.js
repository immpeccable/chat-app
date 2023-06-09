const express = require("express");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const username = process.env.username;
const password = process.env.password;
const appname = process.env.appname;
const uri = `mongodb+srv://${username}:${password}@${appname}.eizf3rb.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
const { findJWTUser } = require("./validators");
const { ChatroomModel, MessageModel } = require("./models");

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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const response = mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB Atlas");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB Atlas:", error);
      });
    console.log("connected.");
    // Send a ping to confirm a successful connection
  } catch (err) {
    // Ensures that the client will close when you finish/error
    console.error("Error connecting to MongoDB Atlas: ", err);
  }
}

main().catch((err) => {
  console.log(`An error occurred: ${err}`);
});

async function main() {
  const app = express();
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const server = http.createServer(app);
  await run();

  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });

  const PORT = process.env.PORT;

  server.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });

  let active_users = new Map();

  io.on("connection", async (socket) => {
    const user = await findJWTUser(socket.handshake.auth.token);

    if (!user) return;

    active_users.set(user._id.toString(), socket);

    socket.on("messageSent", async (content, room_id) => {
      const chatroom = await ChatroomModel.findById(room_id);
      const participants = chatroom.participants;

      const profile_image_url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: bucketName,
          Key: user.profile_image,
        }),
        { expiresIn: 360000 } // 60 seconds
      );

      participants.forEach(async (uid) => {
        console.log(uid);
        if (active_users.has(uid.toString())) {
          active_users
            .get(uid.toString())
            .emit(
              "messageReceived",
              user.username,
              content,
              profile_image_url,
              room_id
            );
        }
      });
      const message = new MessageModel({
        from_username: user.username,
        content: content,
        from_profile_image: user.profile_image,
      });
      chatroom.messages.push(message);
      await message.save();
      await chatroom.save();
    });

    socket.on("disconnect", () => {
      active_users.delete(user._id.toString());
    });
  });

  const routeDir = path.join(__dirname, "routes");
  const routes = await fs.promises.readdir(routeDir);
  for (const routeFile of routes) {
    const endpoint = require(`./routes/${routeFile}/index.js`);
    endpoint(app);
  }
}
