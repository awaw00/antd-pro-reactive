import { effect, end, ofType, RxStore } from '@awaw00/rxstore';
import { inject, injectable, postConstruct } from 'inversify';
import { FormStore } from '@/stores/base/FormStore';
import { filter, map, mapTo, tap, withLatestFrom } from 'rxjs/operators';

export interface TestState {
  name: string;
}

@injectable()
export class TestStore extends RxStore<TestState> {
  @inject(FormStore)
  public form: FormStore;

  @postConstruct()
  private storeInit () {
    this.form.storeInit({
      abc: 'awefawef'
    });

    this.init({
      initialState: {
        name: 'haha test',
      },
      reducer: state => state,
    });
  }

  @effect()
  private onShouldSubmitForm () {
    return this.action$.pipe(
      ofType(this.form.UPDATE_VALUES),
      withLatestFrom(this.form.state$),
      map(([action, formState]) => formState),
      filter(state => state.currentValues.abc && state.currentValues.abc.length >= 5),
      mapTo(this.form.triggerSubmit()),
    );
  }

  @effect()
  private onSubmit () {
    return this.action$.pipe(
      ofType(this.form.SUBMIT),
      end(),
    );
  }
}
