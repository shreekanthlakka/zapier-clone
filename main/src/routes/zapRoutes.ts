import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import {
    createZap,
    getAllZaps,
    getSingleZap,
} from "../controllers/zapController";

const router = express.Router();

router.route("/").post(isLoggedIn, createZap).get(isLoggedIn, getAllZaps);
router.route("/:zapId").get(isLoggedIn, getSingleZap);

export default router;
