// utils/common.ts

/**
 * Send success response
 */
export const sendSuccess = (res: any, statusCode: number, message: string, data: any = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Send error response
 */
export const sendError = (res: any, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    message,
  });
};
