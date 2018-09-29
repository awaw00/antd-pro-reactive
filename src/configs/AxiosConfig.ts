import { AxiosRequestConfig } from 'axios';
import { inject, injectable } from 'inversify';
import { Env } from '@/services/Env';
import { AxiosResponseConfig, History, IAxiosConfig } from '@/interfaces';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HistoryToken } from '@/ioc/tokens';
import { Notice } from '@/services/Notice';

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
          console.log(res);
          if (res.data && res.data.status !== 1) {
            throw new Error(res.data.msg);
          }
        }),
        catchError((err: Error) => of(err).pipe(
          tap(() => this.notice.message.error(err.message)),
        )),
      ),
    };
  }
}
