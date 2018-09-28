import { injectable } from 'inversify';

@injectable()
export class Env {
  public get dev () {
    return process.env.NODE_ENV === 'development';
  }
  public get prod () {
    return process.env.NODE_ENV === 'production';
  }
  public get mock () {
    return process.env.MOCK === 'true' || !this.prod;
  }
}
