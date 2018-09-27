import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Location } from 'history';

export interface MenuItem {
  icon: string;
  title: string;
  link?: string;
  children?: MenuItem[];
}

export interface AppLocation extends Location {
  query: any;
}

export interface AxiosResponseConfig {
  pipeRes?: (res$: Observable<AxiosResponse>) => Observable<any>;
}

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
