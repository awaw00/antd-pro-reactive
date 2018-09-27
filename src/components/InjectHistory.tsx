import React from 'react';
import { InjectProps } from '@/ioc';
import { RouteComponentProps, withRouter } from 'react-router';
import { ContainerNode } from 'react-inject-props/lib/ContainerNode';
import { HistoryToken } from '@/ioc/tokens';

interface InjectHistoryOwnProps {
  containerNode?: ContainerNode;
}

export type InjectHistoryProps = InjectHistoryOwnProps & RouteComponentProps<any>;

@InjectProps({})
class InjectHistoryCore extends React.Component<InjectHistoryProps> {
  constructor (props: InjectHistoryProps) {
    super(props);

    props.containerNode!.container.bind(HistoryToken).toConstantValue(props.history);
  }

  public render () {
    return this.props.children;
  }
}

export const InjectHistory = withRouter(InjectHistoryCore);
