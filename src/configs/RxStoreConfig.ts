import { RxStoreConfig as IRxStoreConfig } from '@awaw00/rxstore';
import { injectable } from 'inversify';

@injectable()
export class RxStoreConfig implements IRxStoreConfig {
  public get linkService () {
    return {
    };
  }
}
