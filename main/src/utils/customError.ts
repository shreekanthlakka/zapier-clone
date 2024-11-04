class CustomError extends Error {
    public message: string;
    private statusCode: number;
    private error: [] | {};
    private success: boolean;
    constructor(statusCode = 400, message = "error", error = {}) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
        this.success = false;
    }
}

export { CustomError };
