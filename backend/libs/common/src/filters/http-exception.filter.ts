import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx  = host.switchToHttp();
    const res  = ctx.getResponse<Response>();
    const req  = ctx.getRequest<Request>();
    const isProd = process.env.NODE_ENV === 'production';

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code    = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status  = exception.getStatus();
      const body = exception.getResponse();
      message = typeof body === 'string'
        ? body
        : (body as any).message ?? exception.message;
      code    = (body as any).error ?? exception.name;
    } else if (exception instanceof Error) {
      // In prod: never leak stack traces or internal error messages
      if (!isProd) message = exception.message;
      this.logger.error(`${req.method} ${req.url} — ${exception.message}`, exception.stack);
    }

    res.status(status).json({
      statusCode: status,
      code,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
      ...(isProd ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
    });
  }
}
