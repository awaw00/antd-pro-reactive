import React from 'react';
import { InjectProps } from '@/ioc';
import { FormStore, FormState } from '@/stores/base/FormStore';
import { DispatchAbleAction } from '@awaw00/rxstore';
import { RxStoreComponent } from '@/components/RxStoreComponent';

export interface RenderedProps extends FormState {
  submitterId: string;
  updateValues: (partialValues: any) => DispatchAbleAction;
  initValues: (values: any) => DispatchAbleAction;
  resetValues: () => DispatchAbleAction;
  submitValues: () => DispatchAbleAction;
  cancelSubmit: (errors?: any) => DispatchAbleAction;
}

export interface Props {
  children: React.SFC<RenderedProps>;
}

@InjectProps({
  store: FormStore
})
export class FormContainer extends RxStoreComponent<FormState, FormStore, Props> {
  public render () {
    const {children, store, ...otherProps} = this.props;

    return children({
      ...this.state,
      ...otherProps,
      submitterId: this.store.submitterId,
      updateValues: this.store.updateFormValues,
      initValues: this.store.initFormValues,
      resetValues: this.store.resetFormValues,
      submitValues: this.store.submitFormValues,
      cancelSubmit: this.store.cancelSubmit
    });
  }
}
