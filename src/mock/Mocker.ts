import MockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';
import { injectable } from 'inversify';
import { IAxiosMocker } from 'src/interfaces';

@injectable()
export class Mocker implements IAxiosMocker {
  public adapter: MockAdapter;
  public mock (axiosInstance: AxiosInstance) {
    this.adapter = new MockAdapter(axiosInstance, {
      delayResponse: 1000
    });

    this.reg();
  }

  public reg () {
    this.adapter.onGet('/sys/captcha').reply(200, {ok: 1});
  }
}
