import express from "express";

const router = express.Router();

router.route("/catch/:userId/:zapId").post();

export default router;
