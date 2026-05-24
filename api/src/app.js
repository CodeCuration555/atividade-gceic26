const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mkpRouter = require("./mkp");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    team: "MKP",
  });
});

app.use("/api/mkp", mkpRouter);

module.exports = app;
