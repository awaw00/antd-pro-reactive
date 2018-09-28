import {
  AsyncActionType,
  AsyncState,
  asyncTypeDef,
  effect,
  getInitialAsyncState,
  ofType,
  RxStore,
} from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import { FormStore } from '@/stores/base/FormStore';
import { MobileFormStore } from '@/pages/Login/MobileForm/MobileFormStore';
import { AuthService, LoginParams } from '@/services/AuthService';
import { log } from 'util';
import { map, withLatestFrom } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

export interface LoginState {
  loginState: AsyncState;
}

@injectable()
export class LoginStore extends RxStore<LoginState> {
  @asyncTypeDef() public LOGIN!: AsyncActionType;

  private loginCall = (loginParams: LoginParams) => this.action({
    type: this.LOGIN.START,
    payload: loginParams
  });

  @inject(AuthService)
  private authService: AuthService;

  @inject(FormStore)
  public accountFormStore: FormStore;
  @inject(MobileFormStore)
  public mobileFormStore: MobileFormStore;

  @postConstruct()
  private storeInit () {
    this.accountFormStore.storeInit({});
    this.mobileFormStore.storeInit({});

    this.linkService({
      type: this.LOGIN,
      service: this.authService.login,
      state: 'loginState'
    });

    this.init({
      initialState: {
        loginState: getInitialAsyncState()
      },
      reducer: state => state,
    });
  }

  @effect()
  private onLogin () {
    return this.action$.pipe(
      ofType([this.accountFormStore.SUBMIT, this.mobileFormStore.formStore.SUBMIT]),
      withLatestFrom(combineLatest(
        this.accountFormStore.state$,
        this.mobileFormStore.formStore.state$
      )),
      map(([action, [accountFormState, mobileFormState]]) => {
        const params: LoginParams = {
          type: action.type === this.accountFormStore.SUBMIT ? 'account' : 'mobile'
        };
        if (params.type === 'account') {
          const {username, password} = accountFormState.submittedValues;
          params.username = username;
          params.password = password;
        } else {
          const {phone, captcha} = mobileFormState.submittedValues;
          params.phone = phone;
          params.captcha = captcha;
        }

        return params;
      }),
      map(this.loginCall),

    )
  }
}
