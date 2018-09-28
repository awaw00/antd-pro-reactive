import { inject, injectable } from 'inversify';
import { Http } from '@/services/Http';

@injectable()
export class AuthService {
  @inject(Http)
  private http: Http;

  public login = (params: LoginParams) => {
    return this.http.post('/auth/login/account', params);
  };
  public authorize = () => {
    return this.http.get('/auth/info');
  };
}

export interface LoginParams {
  type: 'account' | 'mobile';
  username?: string;
  password?: string;
  phone?: string;
  captcha?: string;
}
