import { throws } from 'assert';

export default class ConsoleLogger {
    public static IsDev(): boolean {
        return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    }

    public static Log(message: unknown, style = ''): void {
        if (this.IsDev()) {
            console.log('%c%s', style, message);
        }
    }

    public static LogGreen(message: unknown): void {
        if (this.IsDev()) {
            this.Log(message, 'color: white; padding: 5px 10px; background-color: green;');
        }
    }

    public static LogRed(message: unknown): void {
        if (this.IsDev()) {
            this.Log(message, 'color: white; padding: 5px 10px; background-color: red;');
        }
    }
}
