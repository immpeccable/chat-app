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
