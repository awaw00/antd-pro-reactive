import { RxStore } from '@awaw00/rxstore';
import { postConstruct } from 'inversify';

export interface MainLayoutState {

}

export class MainLayoutStore extends RxStore<MainLayoutState> {
  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {},
      reducer: state => state
    });
  }
}
