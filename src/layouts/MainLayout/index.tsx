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
const {SubMenu, Item, ItemGroup} = Menu;

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

  public renderMenus = (menus: MenuItem[]) => {
    const {menuCollapsed} = this.state;
    return menus.map(item => {
      const title = item.icon ? <span><Icon type={item.icon}/>{menuCollapsed ? '' : item.title}</span> : item.title;
      const content = item.link ? <Link to={item.link}>{title}</Link> : title;

      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.key} title={content} onTitleClick={this.onTitleClick}>
            {this.renderMenus(item.children)}
          </SubMenu>
        );
      }

      return <Item key={item.key}>{content}</Item>;
    });
  };

  public onTitleClick = (param: any) => {
    this.store.pageMetaStore.subMenuClick(param.key).dispatch();
  };
  public onMenuSelected = (param: any) => {
    this.store.pageMetaStore.menuItemClick(param.key).dispatch();
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
            onSelect={this.onMenuSelected}
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
