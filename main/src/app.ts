import express, { urlencoded } from "express";
import userRouter from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import zapRoutes from "./routes/zapRoutes";

const app = express();

const accessLogStream: Writable = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);
app.use(
    morgan("combined", {
        stream: accessLogStream,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    console.log(
        `${req.url} ==> ${req.method} ==> ${req.headers} ==> ${new Date()}`
    );
    next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/zaps", zapRoutes);

export default app;
