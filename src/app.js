const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const port = process.env.PORT || 5000;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(morgan("combined"));

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("Connect to MongoDB successful"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello I am Quiz App API");
});

const api = require("./routes/index");

app.use("/v1", api);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
