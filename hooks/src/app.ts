import express from "express";
import hooksRouter from "./routes/hooks.router";

const app = express();

app.use("/api/v1/hooks", hooksRouter);

export default app;
