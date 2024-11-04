import { Request, Response, NextFunction } from "express";

const asyncHandler =
    (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (err: any) {
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "internal server error",
                statusCode: err.statusCode || 500,
                error: err,
            });
        }
    };

export { asyncHandler };
