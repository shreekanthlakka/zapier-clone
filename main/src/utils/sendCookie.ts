import { User } from "@prisma/client";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "../controllers/userControllers";
import { omitFields } from "./omitFields";
import { CustomError } from "./customError";

const sendCookie = async (user: User, res: Response) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        const updateToken = await client.user.update({
            where: { id: user.id },
            data: { token },
        });

        const options: {
            httpOnly: boolean;
            secure: boolean;
            maxAge: number;
            sameSite: "strict" | "lax" | "none";
        } = {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 1,
            sameSite: "none",
        };

        res.status(200)
            .cookie("token", token, options)
            .json({
                statusCode: 200,
                message: "User logged in successfully",
                success: true,
                token,
                data: omitFields(user, ["password"]),
            });
    } catch (error: any) {
        await client.user.update({
            where: { id: user.id },
            data: { token: null },
        });
        res.status(error.statusCode || 400).json(
            new CustomError(400, "failed to send cookie", error)
        );
    }
};

export { sendCookie };
