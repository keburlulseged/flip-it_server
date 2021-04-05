import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

const morgan = require("morgan");
const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(`DB connection error: ${err}`));

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// route middleware from routes/ directory
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
