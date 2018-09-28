import React from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
import { AntFormContainer, AntFormContainerProps } from '@/components/base/AntFormContainer';
import { Without } from '@/interfaces';

const style = require('../form.module.less');

const FormItem = Form.Item;

export interface MobileFormProps extends Without<AntFormContainerProps, 'children' | 'store'> {
}

export class MobileForm extends React.Component<MobileFormProps> {
  public render () {
    const {...restProps} = this.props;
    return (
      <AntFormContainer {...restProps} formProps={{className: style.wrapper}}>
        {({form}) => (
          <>
            <FormItem>
              {form.getFieldDecorator(
                'phone',
                {
                  rules: [
                    {required: true, message: '请输入账户名'},
                  ],
                },
              )(
                <Input
                  prefix={<Icon type="user"/>}
                  size="large"
                />,
              )}
            </FormItem>
            <FormItem>
              <Row>
                <Col>
                  {form.getFieldDecorator(
                    'captcha',
                    {
                      rules: [
                        {required: true, message: '请输入密码'},
                      ],
                    },
                  )(
                    <Input size="large" type="password" prefix={<Icon type="lock"/>}/>,
                  )}
                </Col>
                <Col>
                  <Button>获取验证码</Button>
                </Col>
              </Row>
            </FormItem>
            <Button size="large" type="primary" htmlType="submit" className={style.btn}>登录</Button>
          </>
        )}
      </AntFormContainer>
    );
  }
}
