import * as React from 'react';
import { Form } from 'antd';
import { FormComponentProps, FormProps } from 'antd/lib/form/Form';
import { FormContainer, RenderedProps } from '@/components/base/FormContainer';
import { FormStore } from '@/stores/base/FormStore';

export interface AntFormContainerCoreOwnProps {
  formProps?: FormProps;
  children: (renderProps: FormComponentProps & RenderedProps & { onSubmit: (e: React.FormEvent) => void }) => any;
}

export interface AntFormContainerCoreProps extends AntFormContainerCoreOwnProps, FormComponentProps, RenderedProps {
}

export type AntFormContainerProps = AntFormContainerCoreOwnProps & {store?: FormStore};

class AntFormContainerCore extends React.Component<AntFormContainerCoreProps> {
  public onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const {form, submitValues, cancelSubmit} = this.props;

    form.validateFields((errors, values) => {
      if (errors) {
        cancelSubmit(errors).dispatch();
      } else {
        submitValues().dispatch();
      }
    });
  };

  public render () {
    const {children, formProps, form, ...propsFromBaseContainer} = this.props;
    return (
      <Form {...formProps} onSubmit={this.onSubmit}>
        {children({form, ...propsFromBaseContainer, onSubmit: this.onSubmit})}

        <input style={{display: 'none'}} type="submit" id={propsFromBaseContainer.submitterId}/>
      </Form>
    );
  }
}

function valuesToFormFields (values: any) {
  if (values) {
    if (values.toJS) {
      values = values.toJS();
    }

    const fields = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        fields[key] = Form.createFormField({value: values[key]});
      }
    }
    return fields;
  } else {
    return {};
  }
}

const CoreWithForm = Form.create<AntFormContainerCoreProps>({
  onValuesChange (props, values) {
    props.updateValues(values).dispatch();
  },
  mapPropsToFields (props) {
    return valuesToFormFields(props.currentValues);
  },
})(AntFormContainerCore);

export const AntFormContainer = (props: AntFormContainerProps) => {
  return (
    <FormContainer store={props.store}>
      {(renderProps: RenderedProps) => (
        <CoreWithForm {...renderProps} {...props}/>
      )}
    </FormContainer>
  );
}
