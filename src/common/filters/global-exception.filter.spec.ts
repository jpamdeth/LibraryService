import { GlobalExceptionFilter } from './global-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

function makeHost(method = 'GET', url = '/test') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = { method, url };
  return {
    host: {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as unknown as ArgumentsHost,
    json,
    status,
  };
}

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('maps an HttpException to its status code and response body', () => {
    const { host, status, json } = makeHost();
    filter.catch(new HttpException('Not found', HttpStatus.NOT_FOUND), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        path: '/test',
        message: 'Not found',
      }),
    );
  });

  it('maps an unknown error to 500 with a generic message', () => {
    const { host, status, json } = makeHost('POST', '/library/authors');
    filter.catch(new Error('something unexpected'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path: '/library/authors',
      }),
    );
  });

  it('includes a timestamp in the response', () => {
    const { host, json } = makeHost();
    filter.catch(new HttpException('Bad request', HttpStatus.BAD_REQUEST), host);
    const call = json.mock.calls[0][0];
    expect(call.timestamp).toBeDefined();
    expect(new Date(call.timestamp).getTime()).not.toBeNaN();
  });
});
