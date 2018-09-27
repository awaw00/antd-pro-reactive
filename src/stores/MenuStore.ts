import { RxStore } from '@awaw00/rxstore';
import { postConstruct } from 'inversify';

export interface MenuState {

}

export class MenuStore extends RxStore<MenuState> {
  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {},
      reducer: (state, action) => state,
    });
  }
}
