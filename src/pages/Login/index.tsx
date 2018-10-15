import React from 'react';
import classNames from 'classnames';
import { Col, Icon, Row, Tabs } from 'antd';
import { AccountForm } from '@/pages/Login/AccountForm';
import { MobileForm } from '@/pages/Login/MobileForm';
import { RxStoreComponent } from '@/components/RxStoreComponent';
import { LoginState, LoginStore } from '@/pages/Login/LoginStore';
import { InjectProps, ProvideProps } from '@/ioc';
import logo from '@/assets/logo.svg';
import { PageMeta } from '@/components/PageMeta';
import { MobileFormStore } from '@/pages/Login/MobileForm/MobileFormStore';

const style = require('./index.module.less');

const {TabPane} = Tabs;

@ProvideProps([
  LoginStore,
  MobileFormStore,
])
@InjectProps({
  store: LoginStore,
})
export class Login extends RxStoreComponent<LoginState, LoginStore> {
  public render () {
    const {loginState} = this.state;
    return (
      <>
        <PageMeta title="Login"/>
        <Row type="flex" justify="center" className={classNames(style.wrapper, 'fulfilled')}>
          <Col className={style.flex}>
            <header className={style.header}>
              <div className={style.logo}>
                <img src={logo} alt="logo"/>
                <span>Ant Design</span>
              </div>
              <div className={style.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </header>

            <article className={style.main}>
              <Tabs animated={false}>
                <TabPane tab="账户密码登录" key="account">
                  <AccountForm loading={loginState.loading} store={this.store.accountFormStore}/>
                </TabPane>
                <TabPane tab="手机号登录" key="mobile">
                  <MobileForm loading={loginState.loading} store={this.store.mobileFormStore}/>
                </TabPane>
              </Tabs>
            </article>

            <footer className={style.copyright}>
              Copyright <Icon type="copyright"/> 2018 蚂蚁金服体验技术部 & <a href="https://github.com/awaw00">awaw00</a>
            </footer>
          </Col>
        </Row>
      </>
    );
  }
}
