import React from 'react';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { MainLayoutState, MainLayoutStore } from './MainLayoutStore';
import { PageLoading } from '@/components/PageLoading';
import { Icon, Layout, Menu } from 'antd';
import { InjectProps, ProvideProps } from '@/ioc';
import logo from '@/assets/logo.svg';
import { MenuItem } from '@/interfaces';
import { Link } from 'react-router-dom';

const style = require('./index.module.less');

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu, Item} = Menu;

@ProvideProps([
  MainLayoutStore,
])
@InjectProps({
  store: MainLayoutStore,
})
export class MainLayout extends RxStoreComponent<MainLayoutState, MainLayoutStore> {
  public componentDidMount () {
    this.store.menuStore.getMenus().dispatch();
  }

  public switchMenuCollapse = (collapsed?: boolean) => {
    const {menuCollapsed} = this.state;
    if (typeof collapsed !== 'boolean') {
      collapsed = !menuCollapsed;
    }
    this.store.switchMenuCollapse(collapsed).dispatch();
  };

  public renderMenus = (menus: MenuItem[], parentKeyPath: string[] = []) => {
    const {menuCollapsed} = this.state;
    return menus.map(item => {
      const title = item.icon
        ? (
          <span><Icon type={item.icon}/>{menuCollapsed && parentKeyPath.length === 0 ? '' : item.title}</span>
        )
        : item.title;
      const content = item.link ? <Link to={item.link}>{title}</Link> : title;

      if (item.children && item.children.length > 0) {
        const currentKeyPath = [...parentKeyPath, item.key];
        return (
          <SubMenu key={item.key} title={content} onTitleClick={() => this.onSubMenuClick(currentKeyPath)}>
            {this.renderMenus(item.children, currentKeyPath)}
          </SubMenu>
        );
      }

      return <Item key={item.key}>{content}</Item>;
    });
  };

  public onSubMenuClick = (keyPpath: string[]) => {
    this.store.menuStore.subMenuClick(keyPpath).dispatch();
  };

  public onMenuOpenChange = (keyPath: string[]) => {
    if (this.state.menuCollapsed) {
      this.store.menuStore.menuOpen(keyPath).dispatch();
    }
  };
  public onMenuSelected = (param: any) => {
    this.store.menuStore.menuItemClick(param.key).dispatch();
  };

  public render () {
    const {children} = this.props;
    const {menus, menuCollapsed, openedMenuKeys, selectedMenuKey} = this.state;

    if (menus.loading || !menus.data) {
      return <PageLoading/>
    }

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

          <Menu
            theme="dark"
            mode="inline"
            openKeys={menuCollapsed ? [] : openedMenuKeys}
            selectedKeys={selectedMenuKey ? [selectedMenuKey] : []}
            inlineCollapsed={menuCollapsed}
            onSelect={this.onMenuSelected}
            onOpenChange={this.onMenuOpenChange}
          >
            {this.renderMenus(menus.data!)}
          </Menu>
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
