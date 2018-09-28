import { Container } from 'inversify';
import { ActionStream } from '@awaw00/rxstore/lib/tokens';
import { Action } from '@awaw00/rxstore';
import { Subject } from 'rxjs';
import { createPropsDecorators } from 'react-inject-props';
import { FormStore } from '@/stores/base/FormStore';
import { ModalStore } from '@/stores/base/ModalStore';
import { LoginStore } from '@/stores/LoginStore';
import { MainLayoutStore } from '@/stores/MainLayoutStore';
import { SysService } from '@/services/SysService';
import { createBrowserHistory } from 'history';
import { HistoryToken } from '@/ioc/tokens';
import { Http } from '@/services/Http';
import { RouterStore } from '@/stores/RouterStore';

const container = new Container();

// constants
container.bind(ActionStream).toConstantValue(new Subject<Action>());
container.bind(HistoryToken).toConstantValue(createBrowserHistory());

// stores
container.bind(FormStore).toSelf();
container.bind(ModalStore).toSelf();

container.bind(RouterStore).toSelf().inSingletonScope();
container.bind(MainLayoutStore).toSelf().inSingletonScope();
container.bind(LoginStore).toSelf();

// services
container.bind(Http).toSelf().inSingletonScope();
container.bind(SysService).toSelf().inSingletonScope();

const {containerManager, ProvideProps, InjectProps} = createPropsDecorators(container);

export {
  containerManager,
  ProvideProps,
  InjectProps,
};
