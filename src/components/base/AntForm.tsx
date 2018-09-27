import React from 'react';
import { AntFormContainer, AntFormContainerCoreOwnProps } from '@/components/base/AntFormContainer';

export interface AntFormProps extends AntFormContainerCoreOwnProps {
}

export class AntForm extends React.Component<AntFormProps> {
  public render () {
    const {formProps} = this.props;
    return (
      <AntFormContainer formProps={formProps}>
        {({form}) => {
          return (
            <div/>
          );
        }}
      </AntFormContainer>
    )
  }
}
