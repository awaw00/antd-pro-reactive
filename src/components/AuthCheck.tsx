import React from 'react';
import { AuthState, AuthStore } from '@/stores/AuthStore';
import { PageLoading } from '@/components/PageLoading';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { InjectProps } from '@/ioc';

@InjectProps({
  store: AuthStore
})
export class AuthCheck extends RxStoreComponent<AuthState, AuthStore> {
  public componentDidMount () {
    this.store.authorize().dispatch();
  }

  public render () {
    const {authorized, authorizing} = this.state;

    if (authorizing) {
      return (
        <PageLoading/>
      );
    }

    if (authorized) {
      return this.props.children;
    }

    return null;
  }
}
