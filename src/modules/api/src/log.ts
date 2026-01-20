export interface Log {
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
}
