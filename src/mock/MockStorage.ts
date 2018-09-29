import { injectable } from 'inversify';
import { Persistent } from '@/services/Persistent';

@injectable()
export class MockStorage {
  private keyPrefix = 'mock_state';
  constructor (
    private persistent: Persistent
  ) {
  }

  public getState<T = any> (key: string) {
    return this.persistent.getState<T>(`${this.keyPrefix}_${key}`);
  }

  public setState (key: string, value: any) {
    return this.persistent.setState(`${this.keyPrefix}_${key}`, JSON.stringify(value));
  }
}
