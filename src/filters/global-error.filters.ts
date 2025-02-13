import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  private logger = new Logger(CatchEverythingFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const errorLog = this.genLogError(exception);

    const resError = this.genResponseError(exception);

    this.logger.error('Error caught by exception filter:', errorLog);

    if (resError.httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      resError.responseBody.message = 'Something Went Very Wrong';
    }

    httpAdapter.reply(ctx.getResponse(), resError.responseBody, resError.httpStatus);
  }

  genResponseError(exception: unknown) {
    const httpStatus = this.getStatus(exception);
    const responseBody = {
      status: httpStatus,
      message: this.parseErrorMessage(this.getMessage(exception)) || 'Something Went Very Wrong'
    };

    return { httpStatus, responseBody };
  }

  genLogError(exception: unknown) {
    let httpStatus: number;
    let responseBody: any;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = this.genHttpErrorLog(exception, httpStatus);
    } else if (exception instanceof Error) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = this.genErrorLog(exception, httpStatus);
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = this.genUnknownErrorLog(httpStatus);
    }

    return { httpStatus, responseBody };
  }

  genHttpErrorLog(exception: HttpException, httpStatus: number) {
    return {
      status: httpStatus,
      message: this.parseErrorMessage(this.getMessage(exception)),
      error: exception.getResponse(),
      stack: exception.stack
    };
  }

  genErrorLog(exception: Error, httpStatus: number) {
    return {
      status: httpStatus,
      message: this.parseErrorMessage(this.getMessage(exception)),
      error: exception.name,
      stack: exception.stack
    };
  }

  genUnknownErrorLog(httpStatus: number) {
    return {
      status: httpStatus,
      error: 'Unknown Error',
      message: 'An unknown error occurred',
      stack: null
    };
  }

  getStatus(exception: HttpException | Error | unknown): number {
    if (exception instanceof HttpException) return exception.getStatus();
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getMessage(exception: HttpException | Error | unknown): string {
    if (exception instanceof HttpException || exception instanceof Error) return exception.message;
    else return 'An unknown error occurred';
  }

  parseErrorMessage(message: string): string {
    if (message.endsWith('exception') || message.endsWith('Exception')) return message.slice(0, message.length - 'exception'.length).trim();
    return message;
  }
}
