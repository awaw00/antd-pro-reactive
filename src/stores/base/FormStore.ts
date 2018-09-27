import { ActionType, effect, end, ofType, RxStore, typeDef } from '@awaw00/rxstore';
import produce from 'immer';
import { tap } from 'rxjs/operators';

export interface FormValues {
  [key: string]: any;
}

export interface FormState<T = FormValues> {
  initialValues: T;
  currentValues: T;
  submittedValues: T;
}

export class FormStore extends RxStore<FormState> {
  @typeDef() public INIT_VALUES!: ActionType;
  @typeDef() public UPDATE_VALUES!: ActionType;
  @typeDef() public RESET_VALUES!: ActionType;
  @typeDef() public SUBMIT!: ActionType;
  @typeDef() public CANCEL_SUBMIT!: ActionType;
  @typeDef() public TRIGGER_SUBMIT!: ActionType;

  public submitterId = `form_submitter_${String(Math.random()).substring(2)}`;

  public updateFormValues = (partialValues: any) => this.action({
    type: this.UPDATE_VALUES,
    payload: partialValues,
  });

  public resetFormValues = () => this.action({
    type: this.RESET_VALUES,
  });

  public initFormValues = (values: any) => this.action({
    type: this.INIT_VALUES,
    payload: values,
  });

  public submitFormValues = () => this.action({
    type: this.SUBMIT,
  });

  public cancelSubmit = (errors?: any) => this.action({
    type: this.CANCEL_SUBMIT,
    payload: errors,
  });

  public triggerSubmit = () => this.action({
    type: this.TRIGGER_SUBMIT
  });

  public storeInit (initialValues: any) {
    this.init({
      initialState: {
        initialValues,
        currentValues: initialValues,
        submittedValues: initialValues,
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.INIT_VALUES: {
            d.initialValues = payload;
            d.currentValues = payload;
            d.submittedValues = payload;
            break;
          }
          case this.UPDATE_VALUES: {
            d.currentValues = Object.assign({}, d.currentValues, payload);
            break;
          }
          case this.RESET_VALUES: {
            d.currentValues = d.initialValues;
            break;
          }
          case this.SUBMIT: {
            d.submittedValues = d.currentValues;
            break;
          }
        }
      }),
    });
  }

  @effect()
  private onTriggerSubmit () {
    return this.action$.pipe(
      ofType(this.TRIGGER_SUBMIT),
      tap(() => {
        const el = document.getElementById(this.submitterId);
        if (el && el.click) {
          el.click();
        }
      }),
      end(),
    );
  }
}
