import express from "express";

import dotenv from "dotenv";
import logger from "./models/logger.model.js"; // http req middleware for express!.. method,url,statuscode,etc
import morgan from "morgan"; // log levels, - transportation -> file/ json structure, or console
// lvls like info, warn, debug, error

dotenv.config({
	path: "./.env",
});
const port = process.env.PORT;

let app = express();

// logger!
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json());




export default app;
