import { message, notification } from 'antd';
import { injectable } from 'inversify';

@injectable()
export class Notice {
  public message = message;
  public notification = notification;
}
