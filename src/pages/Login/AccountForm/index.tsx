import React from 'react';
import { Button, Form, Icon, Input } from 'antd';
import { AntFormContainer, AntFormContainerProps } from '@/components/base/AntFormContainer';
import { Without } from '@/interfaces';

const style = require('./index.module.less');

const FormItem = Form.Item;

export interface AccountFormProps extends Without<AntFormContainerProps, 'children'> {
}

export class AccountForm extends React.Component<AccountFormProps> {
  public render () {
    const {...restProps} = this.props;
    return (
      <AntFormContainer {...restProps} formProps={{className: style.wrapper}}>
        {({form}) => (
          <>
            <FormItem>
              {form.getFieldDecorator(
                'username',
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
              {form.getFieldDecorator(
                'password',
                {
                  rules: [
                    {required: true, message: '请输入密码'},
                  ],
                },
              )(
                <Input size="large" type="password" prefix={<Icon type="lock"/>}/>,
              )}
            </FormItem>
            <Button size="large" type="primary" htmlType="submit" className={style.btn}>登录</Button>
          </>
        )}
      </AntFormContainer>
    );
  }
}
