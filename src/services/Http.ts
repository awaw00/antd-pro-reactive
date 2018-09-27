import { from, Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { inject, injectable, optional } from 'inversify';
import { AxiosConfig } from '@/configs/AxiosConfig';
import { AxiosResponseConfig } from '@/interfaces';

@injectable()
export class Http {
  private readonly requestConfig?: AxiosRequestConfig;
  private readonly responseConfig?: AxiosResponseConfig;
  private readonly mapRes: OperatorFunction<AxiosResponse<any>, any>;

  private client: AxiosInstance;

  constructor (@inject(AxiosConfig) @optional() private axiosConfig: AxiosConfig) {
    if (axiosConfig) {
      this.requestConfig = axiosConfig.request;
      this.responseConfig = axiosConfig.response;
    }

    if (!this.responseConfig || !this.responseConfig.pipeRes) {
      this.responseConfig = {
        ...this.responseConfig,
        pipeRes: res$ => res$.pipe(
          map(res => res.data),
        ),
      };
    }

    this.client = axios.create(this.requestConfig);
  }

  public request<T = any> (config: AxiosRequestConfig) {
    return this.pipeRes<T>(from(this.client.request(config)));
  }

  public get<T = any> (url: string, config?: AxiosRequestConfig) {
    return this.pipeRes<T>(from(this.client.get<T>(url, config)));
  }

  public post<T = any> (url: string, data?: any, config?: AxiosRequestConfig) {
    return this.pipeRes(from(this.client.post<T>(url, data, config)));
  }

  public delete<T = any> (url: string, config?: AxiosRequestConfig) {
    return this.pipeRes(from(this.client.delete(url, config) as AxiosPromise<T>));
  }

  public put<T = any> (url: string, data?: any, config?: AxiosRequestConfig) {
    return this.pipeRes(from(this.client.put<T>(url, data, config)).pipe(this.mapRes));
  }

  private pipeRes<T> (res$: Observable<AxiosResponse<T>>) {
    return this.responseConfig!.pipeRes!(res$) as Observable<T>;
  }
}
