const { UserModel } = require("../../models/index.js");

function endpoint(app) {
  app.post("/new-user", async (req, res) => {
    const { username, email, password } = req.body;

    try {
      console.log(username, email, password);
      const newUser = new UserModel({
        username: username,
        password: password,
        email: email,
        friends: [],
      });

      await newUser.setPassword(password);
      newUser
        .save()
        .then(() => {
          console.log("User saved successfully");
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error("Error saving user:", error);
          res.sendStatus(500);
        });

      res.status(200).json({
        message: "User created successfully",
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
}

module.exports = endpoint;
