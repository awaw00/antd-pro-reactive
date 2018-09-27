import React from 'react';
import { Exception } from '@/components/Exception';
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';

export const Exception404 = (props: RouteComponentProps) => (
  <Exception type={404} actions={<Button type="primary" onClick={() => props.history.goBack()}>返回</Button>}/>
);
