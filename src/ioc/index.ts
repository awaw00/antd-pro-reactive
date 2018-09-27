import { Container } from 'inversify';
import { ActionStream } from '@awaw00/rxstore/lib/tokens';
import { Action } from '@awaw00/rxstore';
import { Subject } from 'rxjs';
import { createPropsDecorators } from 'react-inject-props';
import { FormStore } from '@/stores/base/FormStore';
import { ModalStore } from '@/stores/base/ModalStore';
import { TestStore } from '@/stores/TestStore';
import { LoginStore } from '@/stores/LoginStore';
import { MainLayoutStore } from '@/stores/MainLayoutStore';

const container = new Container();

container.bind(ActionStream).toConstantValue(new Subject<Action>());
container.bind(FormStore).toSelf();
container.bind(ModalStore).toSelf();
container.bind(TestStore).toSelf();

container.bind(MainLayoutStore).toSelf().inSingletonScope();
container.bind(LoginStore).toSelf();

const {containerManager, ProvideProps, InjectProps} = createPropsDecorators(container);

export {
  containerManager,
  ProvideProps,
  InjectProps,
};
