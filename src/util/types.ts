export type LogLevel = 'log' | 'warn' | 'error';

export interface Logger {
  (message: string, level?: LogLevel): void;
}
