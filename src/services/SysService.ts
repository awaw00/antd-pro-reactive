import { inject, injectable } from 'inversify';
import { Http } from '@/services/Http';

@injectable()
export class SysService {
  @inject(Http)
  private http: Http;

  public getCaptcha = (params: GetCaptchaParams) => this.http.get('/sys/captcha', {params});
}

export interface GetCaptchaParams {
  phone: string;
}
