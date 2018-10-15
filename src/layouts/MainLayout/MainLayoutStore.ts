import { ActionType, AsyncState, RxStore, typeDef } from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import { MenuStore } from '@/stores/MenuStore';
import { PageMetaStore } from '@/stores/PageMetaStore';
import produce from 'immer';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem } from '@/interfaces';

export interface MainLayoutState {
  menuCollapsed: boolean;
  menus: AsyncState<MenuItem[]>;
  openedMenuKeys: string[];
  selectedMenuKey: string;
}

@injectable()
export class MainLayoutStore extends RxStore<MainLayoutState> {
  @typeDef() public SWITCH_MENU_COLLAPSE: ActionType;

  @inject(MenuStore)
  public menuStore: MenuStore;
  @inject(PageMetaStore)
  public pageMetaStore: PageMetaStore;

  public switchMenuCollapse = (collapsed: boolean) => this.action({
    type: this.SWITCH_MENU_COLLAPSE,
    payload: {collapsed},
  });

  @postConstruct()
  private storeInit () {
    const {openedMenuKeys, selectedMenuKey} = this.pageMetaStore.options.initialState;
    this.init({
      initialState: {
        menuCollapsed: false,
        menus: this.menuStore.options.initialState.menus,
        openedMenuKeys,
        selectedMenuKey
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.SWITCH_MENU_COLLAPSE:
            d.menuCollapsed = payload.collapsed;
            break;
        }
      }),
      merge: state$ => {
        return combineLatest(
          state$,
          this.menuStore.state$,
          this.pageMetaStore.state$,
        ).pipe(
          map(([selfState, menuState, pageMetaState]) => ({
            ...selfState,
            menus: menuState.menus,
            openedMenuKeys: pageMetaState.openedMenuKeys,
            selectedMenuKey: pageMetaState.selectedMenuKey
          })),
        );
      },
    });
  }
}
