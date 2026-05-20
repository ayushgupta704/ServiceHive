import type { Response } from 'express';

interface IResponseData<T> {
  success: true;
  message: string;
  data?: T | undefined;
  meta?: unknown;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: unknown,
) => {
  const responseBody: IResponseData<T> = {
    success: true,
    message,
    data,
    meta,
  };

  return res.status(statusCode).json(responseBody);
};
