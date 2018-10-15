import { ActionType, RxStore, typeDef } from '@awaw00/rxstore';
import { injectable, postConstruct } from 'inversify';
import produce from 'immer';

export interface MainLayoutState {
  menuCollapsed: boolean;
}

@injectable()
export class MainLayoutStore extends RxStore<MainLayoutState> {
  @typeDef() public SWITCH_MENU_COLLAPSE: ActionType;

  public switchMenuCollapse = (collapsed: boolean) => this.action({
    type: this.SWITCH_MENU_COLLAPSE,
    payload: {collapsed},
  });

  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {
        menuCollapsed: false,
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.SWITCH_MENU_COLLAPSE:
            d.menuCollapsed = payload.collapsed;
            break;
        }
      }),
    });
  }
}
