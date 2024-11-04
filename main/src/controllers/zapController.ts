import { ZapCreateSchema } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { CustomError } from "../utils/customError";
import { client } from "./userControllers";

const createZap = asyncHandler(async (req, res) => {
    const parsedData = ZapCreateSchema.safeParse(req.body);

    if (!parsedData.success) {
        throw new CustomError(411, "failed data validation");
    }
    await client.zap.create({
        data: {
            actions: {
                create: parsedData.data.actions.map((action , index) => {
                    actionId; action.availableActionId,
                    sortingOrder:index
                }),
            },
        },
    });
});

const getAllZaps = asyncHandler(async (req, res) => {});

const getSingleZap = asyncHandler(async (req, res) => {});

export { createZap, getAllZaps, getSingleZap };
