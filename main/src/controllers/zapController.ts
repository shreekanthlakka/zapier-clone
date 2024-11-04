import { ZapCreateSchema } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../utils/customError";
import { CustomResponse } from "../utils/customResponse";
import { client } from "./userControllers";

const createZap = asyncHandler(async (req, res) => {
    const parsedData = ZapCreateSchema.safeParse(req.body);
    // @ts-ignore
    const userId = req.user.id;

    if (!parsedData.success) {
        throw new CustomError(411, "failed data validation");
    }

    const createzap = await client.$transaction(async (tx) => {
        const zap = await tx.zap.create({
            data: {
                userId,
                actions: {
                    create: parsedData.data.actions.map((x, i) => ({
                        actionTypeId: x.availableActionId,
                        sortingOrder: i,
                    })),
                },
            },
        });

        const trigger = await tx.trigger.create({
            data: {
                triggerTypeId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            },
        });

        await tx.zap.update({
            where: { id: zap.id },
            data: {
                trigger: {
                    connect: {
                        id: trigger.id,
                    },
                },
            },
        });
    });

    res.status(201).json(new CustomResponse(201, "zap created"));
});

const getAllZaps = asyncHandler(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const zaps = await client.zap.findMany({
        where: {
            userId,
        },
        include: {
            actions: {
                include: {
                    actionType: true,
                },
            },
            trigger: {
                include: {
                    triggerType: true,
                },
            },
        },
    });

    res.status(200).json(new CustomResponse(200, "zaps", zaps));
});

const getSingleZap = asyncHandler(async (req, res) => {
    const { zapId } = req.params;
    // @ts-ignore
    const userId = req.user.id;

    const zap = await client.zap.findFirst({
        where: {
            userId,
            id: zapId,
        },
        include: {
            trigger: {
                include: {
                    triggerType: true,
                },
            },
            actions: {
                include: {
                    actionType: true,
                },
            },
        },
    });

    res.status(200).json(new CustomResponse(200, "zap details", zap));
});

export { createZap, getAllZaps, getSingleZap };
