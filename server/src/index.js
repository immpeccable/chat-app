const express = require("express");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const username = process.env.username;
const password = process.env.password;
const appname = process.env.appname;
const uri = `mongodb+srv://${username}:${password}@${appname}.eizf3rb.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
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
  // const io = socketIO(server, {
  //   cors: {
  //     origin: "http://localhost:5173",
  //     credentials: true,
  //   },
  // });

  const PORT = process.env.PORT;

  server.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });

  // let chatrooms = new Map();

  // io.on("connection", (socket) => {
  //   console.log("connection is created!!");
  //   socket.on("join", (room_id, user_id) => {
  //     socket.join(room_id);
  //     if (!chatrooms.has(room_id)) {
  //       console.log("chatroom is created");
  //       chatrooms.set(room_id, {
  //         participants: new Set(),
  //       });
  //     }
  //     console.log("participant is added");
  //     chatrooms.get(room_id).participants.add(socket.id);
  //     socket.room_id = room_id;
  //   });

  //   socket.on("leave", (room_id, user_id) => {
  //     if (chatrooms.has(room_id)) {
  //       socket.leave(room_id);
  //       chatrooms.get(room_id).participants.delete(socket.id);
  //       if (chatrooms.get(room_id).participants.size === 0) {
  //         chatrooms.delete(room_id);
  //       }
  //     } else {
  //       throw new Error("Cannot leave from unexisting room: ", room_id);
  //     }
  //   });

  //   socket.on("sendMessage", (room_id, message) => {
  //     console.log(room_id, message);
  //     io.to(room_id).emit("message", message);
  //   });

  //   socket.on("disconnect", () => {
  //     const room_id = socket.room_id;
  //     if (room_id && chatrooms.has(room_id)) {
  //       chatrooms.get(room_id).participants.delete(socket.id);
  //       if (chatrooms.get(room_id).participants.size === 0) {
  //         chatrooms.delete(room_id);
  //       }
  //       // Emit an event to notify other users in the chatroom about the user disconnecting
  //       // If no users are left in the chatroom, remove it from the active chatrooms list
  //     }
  //   });
  // });

  const routeDir = path.join(__dirname, "routes");
  const routes = await fs.promises.readdir(routeDir);
  for (const routeFile of routes) {
    const endpoint = require(`./routes/${routeFile}/index.js`);
    endpoint(app);
  }
}
