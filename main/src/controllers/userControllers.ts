import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SignInSchema, SignUpSchema } from "../types";
import { CustomError } from "../utils/customError";
import { CustomResponse } from "../utils/customResponse";
import { sendCookie } from "../utils/sendCookie";
import { omitFields } from "../utils/omitFields";

export const client = new PrismaClient();

const register = asyncHandler(async (req, res) => {
    const parsedData = SignUpSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new CustomError(411, "incurrect inputs");
    }

    const { name, email, password } = req.body;

    const existingUser = await client.user.findFirst({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new CustomError(409, "user already exists");
    }

    const hashedPassowrd = await bcrypt.hash(password, 10);

    const userDetails = await client.user.create({
        data: {
            name,
            email,
            password: hashedPassowrd,
        },
    });

    res.status(200).json(
        new CustomResponse(200, "user", omitFields(userDetails, ["password"]))
    );
});

const login = asyncHandler(async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new CustomError(411, "incurrect inputs");
    }
    const { email, password } = req.body;
    const user = await client.user.findFirst({
        where: {
            email,
        },
    });
    if (!user) {
        throw new CustomError(404, "invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new CustomError(404, "invalid credentials");
    }
    sendCookie(user, res);
});

const currentUser = asyncHandler(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const user = await client.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    if (!user) {
        throw new CustomError(404, "user not found");
    }
    res.status(200).json(new CustomResponse(200, "user", user));
});

const logout = asyncHandler(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const update = await client.user.update({
        where: {
            id: userId,
        },
        data: {
            token: null,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    if (!update) {
        throw new CustomError(404, "user not found");
    }

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 0,
    };
    res.status(200)
        .clearCookie("token", options)
        .json(new CustomResponse(200, "logged out", update));
});

export { register, login, logout, currentUser };
