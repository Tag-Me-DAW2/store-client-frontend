export interface AlertOptions {
  title: string;
  text: string;
  duration?: number;
  dismissible?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}

export interface AlertInterface {
  success(options: AlertOptions): Promise<void>;
  error(options: AlertOptions): Promise<void>;
  warning(options: AlertOptions): Promise<void>;
  info(options: AlertOptions): Promise<void>;
}
