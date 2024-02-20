import dotenv from "dotenv";
import app from "./app.js";
import http from "http";

dotenv.config({
  path: "./env",
});

const server = http.createServer(app);

import connectDB from "./dbConfig/db.js";

await connectDB();

server.on("error", (error) => {
  console.log("Express doesn't connect to database");
  throw error;
});

server.listen(process.env.PORT, () => {
  console.log(`App listening on: ${process.env.PORT} PORT Number`);
});
