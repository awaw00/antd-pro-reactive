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
import { MenuItem } from '@/interfaces';
import { inject, injectable, postConstruct } from 'inversify';
import { MenuService } from '@/services/MenuService';
import { map, withLatestFrom } from 'rxjs/operators';
import { PageMetaStore } from '@/stores/PageMetaStore';
import produce from 'immer';

export interface MenuState {
  menus: AsyncState<MenuItem[]>;
}

@injectable()
export class MenuStore extends RxStore<MenuState> {
  @typeDef() public SUBMENU_CLICK: ActionType;
  @typeDef() public MENU_ITEM_CLICK: ActionType;
  @asyncTypeDef() public GET_MENUS!: AsyncActionType;

  @inject(PageMetaStore)
  public pageMetaStore: PageMetaStore;

  public subMenuClick = (keyPath: string[]) => this.action({
    type: this.SUBMENU_CLICK,
    payload: {keyPath},
  });

  public menuItemClick = (key: string) => this.action({
    type: this.MENU_ITEM_CLICK,
    payload: {key},
  });

  public getMenus = () => this.action({
    type: this.GET_MENUS.START,
  });

  @inject(MenuService)
  private menuService: MenuService;

  @postConstruct()
  private storeInit () {
    this.linkService({
      type: this.GET_MENUS,
      state: 'menus',
      service: this.menuService.getMenus,
      dataSelector: d => d,
    });
    this.init({
      initialState: {
        menus: getInitialAsyncState(),
      },
      reducer: state => state,
    });
  }

  @effect()
  private onSubMenuClick () {
    return this.action$.pipe(
      ofType(this.SUBMENU_CLICK),
      withLatestFrom(this.state$, this.pageMetaStore.state$),
      map(([action, state, pageMetaState]) => {
        const {openedMenuKeys} = pageMetaState;
        const {payload: {keyPath}} = action;

        const lastKey = keyPath[keyPath.length - 1];

        const opened = openedMenuKeys.indexOf(lastKey) >= 0;
        const newOpenedMenuKeys = opened ? produce(keyPath, d => {
          d.splice(keyPath.length - 1);
        }) : keyPath;
        return this.pageMetaStore.updateMeta({
          openedMenuKeys: newOpenedMenuKeys,
        });
      }),
    );
  }

  @effect()
  private onMenuItemClick () {
    return this.action$.pipe(
      ofType(this.MENU_ITEM_CLICK),
      map(action => this.pageMetaStore.updateMeta({selectedMenuKey: action.payload.key})),
    );
  }
}
