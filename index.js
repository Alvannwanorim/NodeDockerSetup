const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");
const postRouter = require("./routes/postRoute");
const userRouter = require("./routes/userRoute");
const RedisStore = require("connect-redis")(session);

let redisClient = redis.createClient({
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT,
  },
});

redisClient
  .connect()
  .then(() => console.log("successfully connected to redis"))
  .catch((err) => console.error(err));

redisClient.on("ready", () => {
  console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
const app = express();

const connectWithRetry = () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log("successfully connected to the DB"))
    .catch((err) => {
      console.error("error connecting to debugger..", err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(cors({}));

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: SESSION_SECRET,

    cookie: {
      resave: false,
      saveUninitialized: false,
      secure: false,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30000,
    },
  })
);
app.get("/", (req, res) => {
  res.send(`<h2>Hi There<h2>`);
});

app.use(express.json());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
