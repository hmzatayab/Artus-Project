
export interface AppError {
    message: string;
    code?: string;
    status?: number;
    response?: {
      data?: {
        message?: string;
      };
    };
  }
  