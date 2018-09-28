import React from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
import { AntFormContainer, AntFormContainerProps } from '@/components/base/AntFormContainer';
import { Without } from '@/interfaces';
import { InjectProps } from '@/ioc';
import { MobileFormState, MobileFormStore } from '@/pages/Login/MobileForm/MobileFormStore';
import { RxStoreComponent } from '@/components/RxStoreComponent';

const style = require('../form.module.less');

const FormItem = Form.Item;

export interface MobileFormProps extends Without<AntFormContainerProps, 'children' | 'store'> {
  loading?: boolean;
}

@InjectProps({
  store: MobileFormStore,
})
export class MobileForm extends RxStoreComponent<MobileFormState, MobileFormStore, MobileFormProps> {
  public getCaptcha = () => {
    this.store.getCaptcha().dispatch();
  };

  public render () {
    const {countdown, getCaptchaState} = this.state;
    const {loading} = this.props;
    return (
      <AntFormContainer store={this.store.formStore} formProps={{className: style.wrapper}}>
        {({form}) => (
          <>
            <FormItem>
              {form.getFieldDecorator(
                'phone',
                {
                  rules: [
                    {required: true, message: '请输入手机号'},
                  ],
                },
              )(
                <Input
                  placeholder="手机号"
                  prefix={<Icon type="mobile"/>}
                  size="large"
                />,
              )}
            </FormItem>
            <FormItem>
              <Row gutter={16}>
                <Col span={16}>
                  {form.getFieldDecorator(
                    'captcha',
                    {
                      rules: [
                        {required: true, message: '请输入验证码'},
                      ],
                    },
                  )(
                    <Input placeholder="验证码" size="large" prefix={<Icon type="mail"/>}/>,
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    className={style.btn}
                    size="large"
                    onClick={this.getCaptcha}
                    disabled={countdown >= 0 || getCaptchaState.loading}
                  >
                    {getCaptchaState.loading
                      ? '发送中'
                      : countdown >= 0 ? `${countdown}s` : '获取验证码'
                    }
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <Button loading={loading} size="large" type="primary" htmlType="submit" className={style.btn}>登录</Button>
          </>
        )}
      </AntFormContainer>
    );
  }
}
