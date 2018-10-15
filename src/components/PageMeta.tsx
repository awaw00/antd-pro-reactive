import React from 'react';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { InjectProps } from '@/ioc';
import { PageMetaStore, PageMetaState } from '@/stores/PageMetaStore';

export interface PageMetaProps {
  title?: string;
  openedMenuKeys?: string[];
  selectedMenuKey?: string;
}

@InjectProps({
  store: PageMetaStore
})
export class PageMeta extends RxStoreComponent<PageMetaState, PageMetaStore, PageMetaProps> {
  public componentDidMount () {
    this.store.updateMeta(this.props).dispatch();
  }
  public render () {
    return null;
  }
}
