import React from 'react';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { MainLayoutState, MainLayoutStore } from './MainLayoutStore';
import { Icon, Layout } from 'antd';
import { InjectProps, ProvideProps } from '@/ioc';
import logo from '@/assets/logo.svg';

const style = require('./index.module.less');

const {Header, Sider, Content, Footer} = Layout;

@ProvideProps([
  MainLayoutStore,
])
@InjectProps({
  store: MainLayoutStore,
})
export class MainLayout extends RxStoreComponent<MainLayoutState, MainLayoutStore> {
  public switchMenuCollapse = (collapsed?: boolean) => {
    const {menuCollapsed} = this.state;
    if (typeof collapsed !== 'boolean') {
      collapsed = !menuCollapsed;
    }
    this.store.switchMenuCollapse(collapsed).dispatch();
  };

  public render () {
    const {children} = this.props;
    const {menuCollapsed} = this.state;
    return (
      <Layout className="fulfilled">
        <Sider
          trigger={null}
          className={style.slider}
          width={256}
          breakpoint="lg"
          collapsible={true}
          collapsed={menuCollapsed}
          onCollapse={this.switchMenuCollapse}
        >
          <header>
            <img className={style.logo} src={logo}/>
            <h1 className={style.title}>Ant Design Pro</h1>
          </header>
        </Sider>
        <Layout>
          <Header className={style.header}>
            <Icon
              className={style.trigger}
              type={menuCollapsed ? 'menu-unfold' : 'menu-fold'}
              theme="outlined"
              onClick={() => this.switchMenuCollapse()}
            />

            <div className={style.right}>
              right
            </div>
          </Header>
          <Content>{children}</Content>
          <Footer>footer</Footer>
        </Layout>
      </Layout>
    );
  }
}
