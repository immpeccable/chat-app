const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { UserModel } = require("../models/index.js");

const createJWT = (userData) => {
  const token = jwt.sign(userData, SECRET_KEY);
  return token;
};

async function validateJWT(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the JWT

    // Check if the decoded token contains the necessary data to identify the user
    const user = await UserModel.findOne({ username: decoded.username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    req.user = user; // Attach the user object to the request for further processing
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

async function findJWTUser(jwt) {
  const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the JWT

  const user = await UserModel.findOne({ username: decoded.username });
  if (!user) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  return user;
}

module.exports = {
  createJWT,
  validateJWT,
  findJWTUser,
};
