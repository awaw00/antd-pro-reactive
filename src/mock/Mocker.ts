import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';
import { injectable } from 'inversify';
import { IAxiosMocker } from 'src/interfaces';
import { LoginParams } from '@/services/AuthService';

@injectable()
export class Mocker implements IAxiosMocker {
  public adapter: MockAdapter;
  private previousCaptcha: string;

  public mock (axiosInstance: AxiosInstance) {
    this.adapter = new MockAdapter(axiosInstance, {
      delayResponse: 1000,
    });

    this.reg();
  }

  public reg () {
    // 获取验证码
    this.adapter.onGet('/sys/captcha').reply((config) => {
      this.previousCaptcha = String(Math.random() * 100000 % 100000);
      return [200, {status: 1, data: this.previousCaptcha}];
    });
    // 登录
    this.adapter.onPost('/auth/login').reply((config) => {
      const {type, username, password, phone, captcha} = config.data as LoginParams;

      let success = false;
      let msg = '';
      if (type === 'account') {
        if (username === 'admin' && password === '888888') {
          success = true;
        } else {
          msg = '用户名或密码错误';
        }
      } else {
        if (phone === '1888888888' && !!captcha && captcha === this.previousCaptcha) {
          success = true;
          this.previousCaptcha = '';
        } else {
          msg = '手机号或验证码错误';
        }
      }

      return [200, {status: success ? 1 : 0, msg}];
    });
  }
}
