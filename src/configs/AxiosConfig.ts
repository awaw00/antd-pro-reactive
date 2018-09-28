import { AxiosRequestConfig } from 'axios';
import { inject, injectable } from 'inversify';
import { Env } from '@/services/Env';
import { AxiosResponseConfig, History, IAxiosConfig } from '@/interfaces';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HistoryToken } from '@/ioc/tokens';

@injectable()
export class AxiosConfig implements IAxiosConfig {
  constructor (private env: Env, @inject(HistoryToken) private history: History) {
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
        tap(res => console.log(res)),
        catchError(err => of(err).pipe(
          tap(() => console.log(err)),
        )),
      ),
    };
  }
}
