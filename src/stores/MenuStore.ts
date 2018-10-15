import { AsyncActionType, AsyncState, asyncTypeDef, getInitialAsyncState, RxStore } from '@awaw00/rxstore';
import { MenuItem } from '@/interfaces';
import { inject, injectable, postConstruct } from 'inversify';
import { MenuService } from '@/services/MenuService';

export interface MenuState {
  menus: AsyncState<MenuItem[]>;
}

@injectable()
export class MenuStore extends RxStore<MenuState> {
  @asyncTypeDef() public GET_MENUS!: AsyncActionType;

  public getMenus = () => this.action({
    type: this.GET_MENUS.START
  });

  @inject(MenuService)
  private menuService: MenuService;

  @postConstruct()
  private storeInit () {
    this.linkService({
      type: this.GET_MENUS,
      state: 'menus',
      service: this.menuService.getMenus,
      dataSelector: d => d
    });
    this.init({
      initialState: {
        menus: getInitialAsyncState(),
      },
      reducer: state => state,
    });
  }
}
