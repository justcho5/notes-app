const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// eslint-disable-next-line import/no-extraneous-dependencies
require("express-async-errors");

const app = express();

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const notesRouter = require("./controllers/notes");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;