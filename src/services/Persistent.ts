import { injectable } from 'inversify';
import { RxStore } from '@awaw00/rxstore';
import { tap } from 'rxjs/operators';

@injectable()
export class Persistent {
  public getRawState (key: string): string | null {
    return localStorage.getItem(key);
  }

  public setRawState (key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getState<T = any> (key: string): T | null {
    const rawState = this.getRawState(key);
    if (rawState) {
      try {
        return JSON.parse(rawState);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  public setState (key: string, value: any) {
    this.setRawState(key, JSON.stringify(value));
  }

  public persistStoreState (key: string, store: RxStore<any>) {
    store.state$ = store.state$.pipe(
      tap(state => this.setState(key, state)),
    );
  }
}
