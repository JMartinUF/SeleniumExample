const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { main } = require("./main.cjs");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("style"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "scriptForm.html"));
});

app.post("/skyboxAPI.cjs", async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const orderNumber = req.body.orderNumber;

  if (!email || !password || !orderNumber) {
    return res.json({ error: true });
  }
  const result = await main(email, password, orderNumber);
  if (result && result.status === "success") {
    res.json(result.data);
  } else {
    res.json({ error: true });
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});