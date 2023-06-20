const { UserModel } = require("../../models/index.js");
const { createJWT } = require("../../validators/index.js");

function endpoint(app) {
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return res.status(404).json({
          message: "Username is not valid",
        });
        return;
      }
      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        return res.status(404).json({
          message: "Password is not valid",
        });
      }

      const token = createJWT(req.body);
      return res.status(200).json({
        jwt: token,
        message: "Logged in successfulyy",
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
