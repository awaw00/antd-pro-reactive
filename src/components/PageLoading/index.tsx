import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';

const style = require('./index.module.less');

export const PageLoading = () => (
  <div className={classNames(style.wrapper, 'fulfilled')}>
    <Spin size="large" spinning={true}/>
  </div>
);
