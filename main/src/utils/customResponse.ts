class CustomResponse {
    private success: Boolean;
    private message: string;
    private data: {} | [] | null;
    private statusCode: number;

    constructor(
        statusCode = 200,
        message = "success",
        data: {} | [] | null = []
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    }
}

export { CustomResponse };
