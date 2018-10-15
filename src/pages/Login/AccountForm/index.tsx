import React from 'react';
import { Button, Form, Icon, Input } from 'antd';
import { AntFormContainer, AntFormContainerProps } from '@/components/base/AntFormContainer';
import { Without } from '@/interfaces';

const style = require('../form.module.less');

const FormItem = Form.Item;

export interface AccountFormProps extends Without<AntFormContainerProps, 'children'> {
  loading?: boolean;
}

export class AccountForm extends React.Component<AccountFormProps> {
  public render () {
    const {loading, ...restProps} = this.props;
    return (
      <AntFormContainer {...restProps} formProps={{className: style.wrapper}}>
        {({form}) => (
          <>
            <FormItem>
              {form.getFieldDecorator(
                'username',
                {
                  rules: [
                    {required: true, message: '请输入用户名'},
                  ],
                },
              )(
                <Input
                  placeholder="用户名 admin"
                  prefix={<Icon type="user"/>}
                  size="large"
                />,
              )}
            </FormItem>
            <FormItem>
              {form.getFieldDecorator(
                'password',
                {
                  rules: [
                    {required: true, message: '请输入密码'},
                  ],
                },
              )(
                <Input
                  placeholder="密码 888888"
                  size="large"
                  type="password"
                  prefix={<Icon type="lock"/>}
                />,
              )}
            </FormItem>
            <Button loading={loading} size="large" type="primary" htmlType="submit" className={style.btn}>登录</Button>
          </>
        )}
      </AntFormContainer>
    );
  }
}
