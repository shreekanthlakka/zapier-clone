import { asyncHandler } from "../utils/asyncHandler";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const hookController = asyncHandler(async (req, res) => {
    const { zapId, userId } = req.params;

    const respon = await client.$transaction(async (tx) => {
        const run = await tx.zapRun.create({
            data: {
                zapId,
                metaData: req.body,
            },
        });

        await tx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            },
        });
    });

    res.status(200).json({
        message: "Zap Run created successfully",
        data: respon,
    });
});
