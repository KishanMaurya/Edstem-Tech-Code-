const express = require("express");
const app = express();
const Index = require("./routes/index.routes");
const con = require("./connection");

app.use(express.json());

app.use("/api", Index);

app.use(function (req, res, next) {
  res.status(404);
  res.send("404: File Not Found");
  return;
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
