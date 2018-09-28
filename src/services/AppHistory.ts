import { HistoryToken } from '@/ioc/tokens';
import { inject, injectable, postConstruct } from 'inversify';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppLocation } from '@/interfaces';
import * as H from 'history';
import qs from 'qs';

@injectable()
export class AppHistory {
  constructor (@inject(HistoryToken) public history: H.History) {
    const query = qs.parse(this.history.location.search.substring(1));
    const location: AppLocation = {
      ...history.location,
      query
    };
    this.pLocation$ = new BehaviorSubject({...location, query});
    this.location$ = this.pLocation$.asObservable();
  }

  private pLocation$: BehaviorSubject<AppLocation>;
  public location$: Observable<AppLocation>;

  @postConstruct()
  private listen () {
    this.history.listen((location: H.Location, action: any) => {
      const query = qs.parse(location.search.substring(1));
      this.pLocation$.next({...location, query});
    });
  }
}
