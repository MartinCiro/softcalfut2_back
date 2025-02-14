export class ResponseBody<T> {
    public ok: boolean;
    public statusCode: number;
    public result: T;

    constructor(ok: boolean, statusCode: number, result: T) {
        this.ok = ok;
        this.statusCode = statusCode;
        this.result = result;
    }
}
