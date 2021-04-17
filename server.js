const express = require("express");
const app = express();
const helmet = require("helmet");

app.use(
  helmet({
    dnsPrefetchControl: false,
    contentSecurityPolicy: false,
  })
);

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/snake game.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
