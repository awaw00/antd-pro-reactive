import { Container } from 'inversify';
import { Action, tokens } from '@awaw00/rxstore';
import { Subject } from 'rxjs';
import { createPropsDecorators } from 'react-inject-props';
import { FormStore } from '@/stores/base/FormStore';
import { ModalStore } from '@/stores/base/ModalStore';
import { MainLayoutStore } from '@/stores/MainLayoutStore';
import { SysService } from '@/services/SysService';
import { createBrowserHistory } from 'history';
import { AxiosConfigToken, AxiosMockerToken, HistoryToken } from '@/ioc/tokens';
import { Http } from '@/services/Http';
import { RouterStore } from '@/stores/RouterStore';
import { Env } from '@/services/Env';
import { Mocker } from '@/mock/Mocker';
import { AxiosConfig } from '@/configs/AxiosConfig';
import { RxStoreConfig } from '@/configs/RxStoreConfig';
import { AuthService } from '@/services/AuthService';

const container = new Container();

const history = createBrowserHistory();

// constants
container.bind(tokens.ActionStream).toConstantValue(new Subject<Action>());
container.bind(HistoryToken).toConstantValue(history);

// configs
container.bind(AxiosConfigToken).to(AxiosConfig).inSingletonScope();
container.bind(tokens.RxStoreConfig).to(RxStoreConfig).inSingletonScope();

// stores
container.bind(FormStore).toSelf();
container.bind(ModalStore).toSelf();

container.bind(RouterStore).toSelf().inSingletonScope();
container.bind(MainLayoutStore).toSelf().inSingletonScope();

// services
container.bind(Env).toSelf().inSingletonScope();
container.bind(Http).toSelf().inSingletonScope();
container.bind(SysService).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();

const env = container.get(Env);
if (env.mock) {
  container.bind(AxiosMockerToken).to(Mocker).inSingletonScope();
}

const {containerManager, ProvideProps, InjectProps} = createPropsDecorators(container);

export {
  containerManager,
  ProvideProps,
  InjectProps,
};
