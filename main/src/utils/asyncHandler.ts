import { NextFunction, Request, Response } from "express";

const asyncHandler = (
    func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (err: any) {
            res.status(err.statusCode || 500).json({
                message: err.message || "internal server error",
                success: false,
                statusCode: err.statusCode || 500,
            });
        }
    };
};

export { asyncHandler };
