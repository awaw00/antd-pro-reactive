import { Observable } from 'rxjs';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  Action,
  Href,
  Location,
  LocationDescriptorObject,
  LocationListener,
  LocationState,
  Path,
  TransitionPromptHook,
  UnregisterCallback,
} from 'history';

export interface History {
  length: number;
  action: Action;
  location: Location;

  push (path: Path, state?: LocationState): void;

  push (location: LocationDescriptorObject): void;

  replace (path: Path, state?: LocationState): void;

  replace (location: LocationDescriptorObject): void;

  go (n: number): void;

  goBack (): void;

  goForward (): void;

  block (prompt?: boolean | string | TransitionPromptHook): UnregisterCallback;

  listen (listener: LocationListener): UnregisterCallback;

  createHref (location: LocationDescriptorObject): Href;
}

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

export interface IAxiosConfig {
  request: AxiosRequestConfig;
  response: AxiosResponseConfig;
}

export interface IAxiosMocker {
  mock (axiosInstance: AxiosInstance): void;
}
