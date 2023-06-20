const { UserModel } = require("../../models/index.js");
const { createJWT, validateJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.get("/home", validateJWT, async (req, res) => {
    console.log("hello world");
    try {
      res.json({
        message: "jwt is verified",
      });
    } catch (err) {}
  });
}

module.exports = endpoint;
