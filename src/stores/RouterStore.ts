import { ActionType, RxStore, typeDef } from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import { History } from '@/interfaces';
import { Action as HistoryAction, Location, UnregisterCallback } from 'history';
import { HistoryToken } from '@/ioc/tokens';

export interface RouterState {
  location: Location;
  action: HistoryAction;
}

@injectable()
export class RouterStore extends RxStore<RouterState> {
  @typeDef() public LOCATION_CHANGE!: ActionType;

  public locationChange = (location: Location, action: HistoryAction) => this.action({
    type: this.LOCATION_CHANGE,
    payload: {
      location,
      action,
    },
  });

  public destroy = () => {
    if (this.unregister) {
      this.unregister();
    }
    this.unsubscriber.unsubscribe();
  };

  private unregister?: UnregisterCallback;
  @inject(HistoryToken)
  private history: History;

  @postConstruct()
  private storeInit () {
    this.init({
      initialState: {
        location: this.history.location,
        action: this.history.action,
      },
      reducer: (state, {type, payload}) => {
        switch (type) {
          case this.LOCATION_CHANGE: {
            const {location, action} = payload;
            const oldLocation = state.location;
            const {pathname, hash, search, state: locationState} = location as Location;
            if (action === state.action && pathname === oldLocation.pathname && hash === oldLocation.hash && search === oldLocation.search && locationState === oldLocation.state) {
              break;
            }
            return payload;
          }
        }
        return state;
      },
    });

    this.unregister = this.history.listen((location, action) => {
      this.locationChange(location, action).dispatch();
    });
  }
}
