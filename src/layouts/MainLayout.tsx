import React from 'react';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { MainLayoutState, MainLayoutStore } from '@/stores/MainLayoutStore';
import { Layout } from 'antd';
import { InjectProps } from '@/ioc';

const { Header, Sider, Content, Footer } = Layout;

@InjectProps({
  store: MainLayoutStore
})
export class MainLayout extends RxStoreComponent<MainLayoutState, MainLayoutStore> {
  public render () {
    const {children} = this.props;
    return (
      <Layout className="fulfilled">
        <Sider>sider</Sider>
        <Layout>
          <Header>header</Header>
          <Content>{children}</Content>
          <Footer>footer</Footer>
        </Layout>
      </Layout>
    );
  }
}
