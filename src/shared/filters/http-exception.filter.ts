import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  BadRequestError,
  ConflictError,
  EntityNotFoundError,
  InvalidCredentialError,
} from '../errors/errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //errores http nest
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    //errors 40
    if (exception instanceof BadRequestError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      });
    }

    //errors 401
    if (exception instanceof InvalidCredentialError) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
    }

    //errors 404
    if (exception instanceof EntityNotFoundError) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ statusCode: HttpStatus.NOT_FOUND, message: exception.message });
    }

    //errors 409
    if (exception instanceof ConflictError) {
      return response
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: HttpStatus.CONFLICT, message: exception.message });
    }

    //errors 500
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
