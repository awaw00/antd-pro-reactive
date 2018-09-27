import { inject, injectable } from 'inversify';
import { Http } from '@/services/Http';

@injectable()
export class AuthService {
  @inject(Http)
  private http: Http;

  public authorize = () => {
    return this.http.get('/auth');
  };
}
