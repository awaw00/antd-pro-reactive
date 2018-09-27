import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const config = {
  403: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403',
    desc: '抱歉，你无权访问该页面',
  },
  404: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
    title: '404',
    desc: '抱歉，你访问的页面不存在',
  },
  500: {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: '抱歉，服务器出错了',
  },
};

const styles = require('./index.module.less');

export interface ExceptionProps {
  actions?: React.ReactNode;
  className?: any;
  title?: string;
  desc?: string;
  img?: string;
  type: number;
}

export class Exception extends React.PureComponent<ExceptionProps> {
  public static defaultProps = {
    actions: <Link to="/"><Button type="primary">返回</Button></Link>
  };
  public render () {
    const {
      className,
      type,
      title,
      desc,
      img,
      actions,
    } = this.props;
    const pageType = type in config ? type : '404';
    const clsString = classNames(styles.exception, className);
    return (
      <div className={clsString}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{backgroundImage: `url(${img || config[pageType].img})`}}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {actions}
          </div>
        </div>
      </div>
    );
  }
}
