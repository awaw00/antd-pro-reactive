import { injectable } from 'inversify';

@injectable()
export class Env {
  public dev: boolean;
  public get prod () {
    return !this.dev;
  }

  constructor () {
    this.dev = true;
  }
}
