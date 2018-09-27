import React from 'react';

const style = require('./index.module.less');

export const PageLoading = () => (
  <div className={style.wrapper}>
    <div className={style.loading}>
      <div/>
      <div/>
      <div/>
    </div>
  </div>
);
