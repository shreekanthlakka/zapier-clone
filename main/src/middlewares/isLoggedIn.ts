import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../utils/customError";
import jwt, { JwtPayload } from "jsonwebtoken";

const isLoggedIn = asyncHandler(async (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret not found");
    }
    const token = req.cookies?.token;
    if (!token) {
        throw new CustomError(401, "not signedIn");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // @ts-ignore
    req.user = decoded as JwtPayload;
    next();
});

export { isLoggedIn };
