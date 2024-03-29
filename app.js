//imports express, morgan, cors, express-rate-limit, initializes express and imports the following files from given paths
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();
const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/user/userRouter");
const twilioRouter = require("./routes/twilio/twillioRouter");
const friendRouter = require("./routes/friend/friendRouter");

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

//sets limit for requests
const limiter = rateLimit({
  max: 20,
  windowMs: 1 * 60 * 1000, //this is in millie seconds
  message:
    "Too many requests from this IP, please try again or contact support",
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", userRouter);
app.use("/api/twilio", twilioRouter);
app.use("/api/friend", friendRouter);

app.all("*", function (req, res, next) {
  next(
    new ErrorMessageHandlerClass(
      `Cannot find ${req.originalUrl} on this server! Check your URL`,
      404
    )
  );
});
app.use(errorController);
module.exports = app;
