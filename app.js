import express from "express";
import cors from "cors";
import userRouter from "./router/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  express.json({
    limit: "16kb",
  })
);


app.use("/message", userRouter);

export default app;
