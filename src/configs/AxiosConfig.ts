import { AxiosRequestConfig } from 'axios';
import { injectable } from 'inversify';
import { Env } from '@/services/Env';
import { AxiosResponseConfig } from '@/interfaces';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppHistory } from '@/services/AppHistory';

@injectable()
export class AxiosConfig {
  constructor (private env: Env, private appHistory: AppHistory) {
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
          // tap(() => this.appHistory.history.push('/500')),
        )),
      ),
    };
  }
}
