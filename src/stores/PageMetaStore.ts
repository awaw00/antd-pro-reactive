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
  @typeDef() public SUBMENU_CLICK: ActionType;
  @typeDef() public MENU_ITEM_CLICK: ActionType;
  @typeDef() public UPDATE_META!: ActionType;

  public updateMeta = (meta: Partial<PageMetaState>) => this.action({
    type: this.UPDATE_META,
    payload: meta,
  });

  public subMenuClick = (key: string) => this.action({
    type: this.SUBMENU_CLICK,
    payload: {key}
  });

  public menuItemClick = (key: string) => this.action({
    type: this.MENU_ITEM_CLICK,
    payload: {key}
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
          case this.MENU_ITEM_CLICK:
            d.selectedMenuKey = payload.key;
            break;
          case this.SUBMENU_CLICK: {
            const {key} = payload;
            const index = d.openedMenuKeys.indexOf(key);
            if (index >= 0) {
              d.openedMenuKeys.splice(index, 1);
            } else {
              d.openedMenuKeys.push(key);
            }
            break;
          }

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
