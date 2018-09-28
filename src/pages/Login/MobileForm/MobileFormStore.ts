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
import { FormState, FormStore } from '@/stores/base/FormStore';
import produce from 'immer';
import { GetCaptchaParams, SysService } from '@/services/SysService';
import { filter, map, mapTo, switchMap, takeWhile, withLatestFrom } from 'rxjs/operators';
import { combineLatest, concat, interval, of } from 'rxjs';

export interface MobileFormState {
  countdown: number;
  getCaptchaState: AsyncState;
  form: FormState;
}

@injectable()
export class MobileFormStore extends RxStore<MobileFormState> {
  @typeDef() public COUNTDOWN!: ActionType;
  @typeDef() public TRY_GET_CAPTCHA!: ActionType;

  @asyncTypeDef() public GET_CAPTCHA!: AsyncActionType;

  @inject(FormStore)
  public formStore: FormStore;

  public getCaptcha = () => this.action({
    type: this.TRY_GET_CAPTCHA,
  });

  private getCaptchaCall = (params: GetCaptchaParams) => this.action({
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
        form: this.formStore.options.initialState,
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.GET_CAPTCHA.END:
            d.countdown = 10;
            break;
          case this.COUNTDOWN:
            d.countdown--;
            break;
        }
      }),
    });

    this.state$ = combineLatest(
      this.state$,
      this.formStore.state$,
    ).pipe(
      map(([selfState, formState]) => ({
        ...selfState,
        form: formState,
      })),
    );
  }

  @effect()
  private onGetCaptcha () {
    return this.action$.pipe(
      ofType(this.TRY_GET_CAPTCHA),
      withLatestFrom(this.state$),
      filter(([action, state]) => {
        return state.countdown <= 0;
      }),
      switchMap(([action, state]) => concat(
        of(this.getCaptchaCall({phone: state.form.currentValues.phone})),
        this.action$.pipe(
          ofType(this.GET_CAPTCHA.END),
          switchMap(() => interval(1000)),
          withLatestFrom(this.state$),
          takeWhile(([v, s]) => s.countdown >= 0),
          mapTo({type: this.COUNTDOWN}),
        ),
      )),
    );
  }
}
