import { AxiosRequestConfig } from 'axios';
import { inject, injectable } from 'inversify';
import { Env } from '@/services/Env';
import { AxiosResponseConfig, History, IAxiosConfig } from '@/interfaces';
import { catchError, ignoreElements, skipWhile, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HistoryToken } from '@/ioc/tokens';
import { Notice } from '@/services/Notice';

class ApiResponseError extends Error {
  constructor (public response: { status: number, msg: string }) {
    super(response.msg);
  }
}

function isApiResponseError (err: Error): err is ApiResponseError {
  return !!(err as ApiResponseError).response;
}

@injectable()
export class AxiosConfig implements IAxiosConfig {
  constructor (
    private env: Env,
    private notice: Notice,
    @inject(HistoryToken) private history: History,
  ) {
  }

  public get request (): AxiosRequestConfig {
    return {
      baseURL: this.env.dev ? `//localhost:8008` : `//api-server.com`,
      withCredentials: true,
    };
  }

  public get response (): AxiosResponseConfig {
    return {
      pipeRes: res$ => res$.pipe(
        tap(res => {
          if (res.data && res.data.status !== 1) {
            throw new ApiResponseError(res.data);
          }
        }),
        catchError((err: Error) => of(err).pipe(
          tap(() => {
            this.notice.message.error(err.message);

            if (isApiResponseError(err)) {
              if (err.response.status === 401) {
                this.history.push('/login?from=' + encodeURIComponent(window.location.href));
                return;
              }
            }
            throw err;
          }),
          ignoreElements(),
        )),
      ),
    };
  }
}
