import React from 'react';
import { RxStore } from '@awaw00/rxstore';
import { Subscription } from 'rxjs';

export class RxStoreComponent<S extends object, T extends RxStore<S>, P = {}> extends React.Component<P & {store?: T}, S> {
  public store: T;
  public readonly subscription: Subscription;
  constructor (props: P & {store?: T}) {
    super(props);

    this.store = props.store!;
    this.subscription = this.store.state$.subscribe(state => {
      if (this.state) {
        this.setState(state);
      } else {
        this.state = state;
      }
    });

    const orgWillUnmount = this.componentWillUnmount || null;
    this.componentWillUnmount = () => {
      this.unsubscribe();
      if (orgWillUnmount) {
        orgWillUnmount.call(this);
      }

      (this.store as any) = null;
    }
  }

  public unsubscribe () {
    this.subscription.unsubscribe();
  }
}
