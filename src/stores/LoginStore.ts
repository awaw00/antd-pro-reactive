import { RxStore } from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import { FormStore } from '@/stores/base/FormStore';

export interface LoginState {

}

@injectable()
export class LoginStore extends RxStore<LoginState> {
  @inject(FormStore)
  public accountFormStore: FormStore;
  @inject(FormStore)
  public mobileFormStore: FormStore;

  @postConstruct()
  private storeInit () {
    this.accountFormStore.storeInit({});
    this.mobileFormStore.storeInit({});

    this.init({
      initialState: {},
      reducer: state => state,
    });
  }
}
