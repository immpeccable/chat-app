const express = require("express");
const app = express();
const port = 3000;

const exampleRouter = require("./routes/ExampleRoute/index");

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.use("/", exampleRouter);

module.exports = app;
