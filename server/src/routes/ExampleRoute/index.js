function endpoint(app) {
  console.log("hello world");
  app.get("/", (req, res) => {
    console.log("wtf buddy");
    res.json("hello world");
  });
}

module.exports = endpoint;
