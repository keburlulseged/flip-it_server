import express from "express";


const router = express.Router();

import { createConnectAccount } from "../controllers/stripe";
import { requireSignIn } from "../middlewares";

router.post("/create-connect-account", requireSignIn, createConnectAccount);

module.exports = router;
