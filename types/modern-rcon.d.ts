export = rcon;
declare class rcon {
    constructor(host: any, port: any, password: any, timeout: any);
    host: any;
    port: any;
    password: any;
    timeout: any;
    hasAuthed: any;
    connect(): any;
    disconnect(): any;
    send(data: any, cmd: any): any;
}
declare namespace rcon {
    class RconError {
        static captureStackTrace(p0: any, p1: any): any;
        static stackTraceLimit: number;
        constructor(message: any);
    }
}
