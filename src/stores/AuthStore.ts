import { AsyncActionType, asyncTypeDef, effect, ofType, RxStore } from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import produce from 'immer';
import { AuthService } from '@/services/AuthService';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface AuthState {
  authorizing: boolean;
  authorized: boolean;
}

@injectable()
export class AuthStore extends RxStore<AuthState> {
  @asyncTypeDef() public AUTHORIZE!: AsyncActionType;
  public authorize = () => this.action({
    type: this.AUTHORIZE.START,
  });
  @inject(AuthService)
  private authService: AuthService;

  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {
        authorized: false,
        authorizing: false,
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.AUTHORIZE.START: {
            d.authorized = false;
            d.authorizing = true;
            break;
          }
          case this.AUTHORIZE.END: {
            d.authorizing = false;
            d.authorized = true;
            break;
          }
          case this.AUTHORIZE.ERR: {
            d.authorizing = false;
            break;
          }
        }
      }),
    });
  }

  @effect()
  private onAuthorize () {
    return this.action$.pipe(
      ofType(this.AUTHORIZE.START),
      switchMap((action) => this.authService.authorize().pipe(
        map(res => ({type: this.AUTHORIZE.END, payload: res})),
        catchError(err => of({type: this.AUTHORIZE.ERR, payload: err})),
      )),
    );
  }
}
