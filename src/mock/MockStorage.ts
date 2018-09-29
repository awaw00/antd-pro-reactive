import { injectable } from 'inversify';
import { Persistent } from '@/services/Persistent';

@injectable()
export class MockStorage {
  public isLogin = this.createState('isLogin', false);
  public phone = this.createState('phone', '');
  public captcha = this.createState('captcha', '');

  private keyPrefix = 'mock_state';

  constructor (
    private persistent: Persistent,
  ) {
  }

  public getState<T = any> (key: string) {
    return this.persistent.getState<T>(`${this.keyPrefix}_${key}`);
  }

  public setState (key: string, value: any) {
    return this.persistent.setState(`${this.keyPrefix}_${key}`, JSON.stringify(value));
  }

  public createState<T = any> (key: string, initialValue?: T) {
    const storage = this;
    return {
      get () {
        return storage.getState<T>(key);
      },
      set (value: T) {
        storage.setState(key, value);
      },
    };
  }
}
