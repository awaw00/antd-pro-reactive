import {
  ActionType,
  AsyncActionType,
  AsyncState,
  asyncTypeDef,
  effect,
  getInitialAsyncState,
  ofType,
  RxStore,
  typeDef,
} from '@awaw00/rxstore';
import { inject, injectable } from 'inversify';
import { FormStore } from '@/stores/base/FormStore';
import produce from 'immer';
import { GetCaptchaParams, SysService } from '@/services/SysService';
import { filter, switchMap, takeWhile, withLatestFrom } from 'rxjs/operators';
import { concat, interval, of } from 'rxjs';

export interface MobileFormState {
  countdown: number;
  getCaptchaState: AsyncState;
}

@injectable()
export class MobileFormStore extends RxStore<MobileFormState> {
  @typeDef() public COUNTDOWN!: ActionType;
  @typeDef() public TRY_GET_CAPTCHA!: ActionType;

  @asyncTypeDef() public GET_CAPTCHA!: AsyncActionType;
  @inject(FormStore)
  public formStore: FormStore;
  public getCaptcha = (params: GetCaptchaParams) => this.action({
    type: this.GET_CAPTCHA.START,
    payload: params,
  });
  @inject(SysService)
  private sysService: SysService;

  public storeInit (initialValues: any) {
    this.formStore.storeInit(initialValues);

    this.linkService({
      type: this.GET_CAPTCHA,
      service: this.sysService.getCaptcha,
      state: 'getCaptchaState',
    });

    this.init({
      initialState: {
        countdown: -1,
        getCaptchaState: getInitialAsyncState(),
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.GET_CAPTCHA.END:
            d.countdown = 60;
            break;
          case this.COUNTDOWN:
            d.countdown--;
            break;
        }
      }),
    });
  }

  @effect()
  private onGetCaptcha () {
    return this.action$.pipe(
      ofType(this.TRY_GET_CAPTCHA),
      withLatestFrom(this.state$),
      filter(([action, state]) => {
        return state.countdown <= 0;
      }),
      withLatestFrom(this.formStore.state$),
      switchMap(() => concat(
        of(this.getCaptcha({phone: ''})),
        this.action$.pipe(
          ofType(this.GET_CAPTCHA.END),
          switchMap(() => interval(1000)),
          withLatestFrom(this.state$),
          takeWhile(([v, state]) => state.countdown > 0),
        ),
      )),
    );
  }
}
