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
import { MobileFormStore } from './MobileForm/MobileFormStore';
import { AuthService, LoginParams } from '@/services/AuthService';
import { ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { HistoryToken } from '@/ioc/tokens';
import { History } from '@/interfaces';
import qs from 'qs';

export interface LoginState {
  loginState: AsyncState;
}

@injectable()
export class LoginStore extends RxStore<LoginState> {
  @asyncTypeDef() public LOGIN!: AsyncActionType;
  @inject(FormStore)
  public accountFormStore: FormStore;
  @inject(MobileFormStore)
  public mobileFormStore: MobileFormStore;
  private loginCall = (loginParams: LoginParams) => this.action({
    type: this.LOGIN.START,
    payload: loginParams,
  });
  @inject(HistoryToken)
  private history: History;
  @inject(AuthService)
  private authService: AuthService;

  @postConstruct()
  private storeInit () {
    this.accountFormStore.storeInit({});
    this.mobileFormStore.storeInit({});

    this.linkService({
      type: this.LOGIN,
      service: this.authService.login,
      state: 'loginState',
    });

    this.init({
      initialState: {
        loginState: getInitialAsyncState(),
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
        this.mobileFormStore.formStore.state$,
      )),
      map(([action, [accountFormState, mobileFormState]]) => {
        const params: LoginParams = {
          type: action.type === this.accountFormStore.SUBMIT ? 'account' : 'mobile',
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
    );
  }

  @effect()
  private onLoginSuccess () {
    return this.action$.pipe(
      ofType(this.LOGIN.END),
      tap(() => {
        const {replace, location} = this.history;
        const query = qs.parse(location.search.substring(1));

        let url = query.redirect ? decodeURIComponent(query.redirect) : '/';
        const match = url.match(/^https?:\/\/(.*?)(\/.*)$/);
        if (match && match[1]) {
          if (match[1] === window.location.host) {
            url = match[2] || '/';
          } else {
            window.location.href = url;
            return;
          }
        }
        replace(url);
      }),
      ignoreElements(),
    );
  }
}
