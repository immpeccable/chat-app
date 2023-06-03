const express = require("express");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

main().catch((err) => {
  console.log(`An error occurred: ${err}`);
});

async function main() {
  const app = express();

  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });

  const routeDir = path.join(__dirname, "routes");
  const routes = await fs.promises.readdir(routeDir);
  for (const routeFile of routes) {
    const endpoint = require(`./routes/${routeFile}/index.js`);
    endpoint(app);
  }
}
