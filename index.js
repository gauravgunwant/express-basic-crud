import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js"; // http req middleware for express!.. method,url,statuscode,etc
import morgan from "morgan"; // log levels, - transportation -> file/ json structure, or console
// lvls like info, warn, debug, error
dotenv.config({
	path: "./.env",
});
const port = process.env.PORT;

let app = express();

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

let nData = [];
let counter = 0;
app.use(express.json({ limit: "16kb" }));

// create new data
app.post("/info", (req, res) => {
	let { name, email } = req.body;
	let obj = {
		id: ++counter,
		name,
		email,
	};

	nData.push(obj);

	res.status(201).send(obj);
});

// get all data
app.get("/info", (req, res) => {
	res.send(nData);
});

// get specific data
app.get("/info/:id", (req, res) => {
	let newDat = nData.find((t) => {
		if (t.id === parseInt(req.params.id)) return true;
	});
	if (!newDat) {
		res.status(404).send("data doesn't exist");
	} else {
		res.send(newDat);
	}
});

// updating the data

app.put("/info/:id", (req, res) => {
	let { name, email } = req.body;
	console.log(name, email);
	let newDat = nData.find((t) => {
		if (t.id === parseInt(req.params.id)) return true;
	});
	if (!newDat) {
		res.status(404).send("data doesn't exist");
	} else {
		newDat.name = name;
		newDat.email = email;
		res.send(newDat);
	}
});

// delete the data

app.delete("/info/:id", (req, res) => {
	let i = nData.findIndex((t) => {
		if (t.id === parseInt(req.params.id)) return true;
	});
	console.log(i);
	if (i !== -1) {
		nData.splice(i, 1);
		res.status(200).send("Deleted the data!");
	} else {
		res.status(404).send("Data not found!");
	}
});

app.get("/", (req, res) => {
	res.send("Hey I m landing page!");
});

app.listen(port, () => {
	console.log(`Listening to http://localhost:${port}`);
});
