import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';
import { inject, injectable } from 'inversify';
import { IAxiosMocker } from 'src/interfaces';
import { LoginParams } from '@/services/AuthService';
import { MockStorage } from '@/mock/MockStorage';

@injectable()
export class Mocker implements IAxiosMocker {
  public adapter: MockAdapter;

  @inject(MockStorage)
  private storage: MockStorage;

  public mock (axiosInstance: AxiosInstance) {
    this.adapter = new MockAdapter(axiosInstance, {
      delayResponse: 1000,
    });

    this.reg();
  }

  public reg () {
    // 获取验证码
    this.adapter.onGet('/sys/captcha').reply((config) => {
      const captcha  = String(Math.floor(Math.random() * 1000000) % 1000000);
      alert(`验证码为${captcha}`);
      this.storage.phone.set(config.params.phone);
      this.storage.captcha.set(captcha);
      return [200, {status: 1, data: captcha}];
    });
    // 获取身份认证信息
    this.adapter.onGet('/auth/info').reply((config) => {
      const isLogin = this.storage.isLogin.get();
      return [200, {status: isLogin ? 1 : 401, msg: isLogin ? '' : '请登录', data: isLogin}];
    });
    // 登录
    this.adapter.onPost('/auth/login').reply((config) => {
      const {type, username, password, phone, captcha} = JSON.parse(config.data) as LoginParams;

      let success = false;
      let msg = '';
      if (type === 'account') {
        if (username === 'admin' && password === '888888') {
          success = true;
        } else {
          msg = '用户名或密码错误';
        }
      } else {
        const rightCaptcha = this.storage.captcha.get();
        const rightPhone = this.storage.phone.get();
        if (phone === rightPhone && !!captcha && captcha === rightCaptcha) {
          success = true;
          this.storage.captcha.set('');
        } else {
          msg = '手机号或验证码错误';
        }
      }

      if (success) {
        this.storage.isLogin.set(true);
      }

      return [200, {status: success ? 1 : 0, msg}];
    });

    this.adapter.onAny().passThrough();
  }
}
