import { ActionType, effect, ofType, RxStore, typeDef } from '@awaw00/rxstore';
import { injectable, postConstruct } from 'inversify';
import produce from 'immer';
import { ignoreElements, tap } from 'rxjs/operators';

export interface PageMetaState {
  title: string;
  openedMenuKeys: string[];
  selectedMenuKey: string;
}

@injectable()
export class PageMetaStore extends RxStore<PageMetaState> {
  @typeDef() public UPDATE_META!: ActionType;

  public updateMeta = (meta: Partial<PageMetaState>) => this.action({
    type: this.UPDATE_META,
    payload: meta,
  });

  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {
        title: '',
        openedMenuKeys: [],
        selectedMenuKey: ''
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.UPDATE_META:
            return {...d, ...payload};
        }
      }),
    });
  }

  @effect()
  private onUpdateMeta () {
    return this.action$.pipe(
      ofType(this.UPDATE_META),
      tap(({payload}) => {
        if (payload.title) {
          document.title = payload.title;
        }
      }),
      ignoreElements(),
    );
  }
}
