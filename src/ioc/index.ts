import { Container } from 'inversify';
import { Action, tokens } from '@awaw00/rxstore';
import { Subject } from 'rxjs';
import { createPropsDecorators } from 'react-inject-props';
import { FormStore } from '@/stores/base/FormStore';
import { ModalStore } from '@/stores/base/ModalStore';
import { SysService } from '@/services/SysService';
import { createBrowserHistory } from 'history';
import { AxiosConfigToken, AxiosMockerToken, HistoryToken } from '@/ioc/tokens';
import { Http } from '@/services/Http';
import { RouterStore } from '@/stores/RouterStore';
import { Env } from '@/services/Env';
import { Mocker } from '@/mock/Mocker';
import { MockStorage } from '@/mock/MockStorage';
import { AxiosConfig } from '@/configs/AxiosConfig';
import { RxStoreConfig } from '@/configs/RxStoreConfig';
import { AuthService } from '@/services/AuthService';
import { Notice } from '@/services/Notice';
import { AuthStore } from '@/stores/AuthStore';
import { Persistent } from '@/services/Persistent';
import { filter } from 'rxjs/operators';

const container = new Container();

const action$ = new Subject<Action>();
const history = createBrowserHistory();

// constants
container.bind(tokens.ActionStream).toConstantValue(action$);
container.bind(HistoryToken).toConstantValue(history);

// configs
container.bind(AxiosConfigToken).to(AxiosConfig).inSingletonScope();
container.bind(tokens.RxStoreConfig).to(RxStoreConfig).inSingletonScope();

// stores
container.bind(FormStore).toSelf();
container.bind(ModalStore).toSelf();

container.bind(RouterStore).toSelf().inSingletonScope();
container.bind(AuthStore).toSelf().inSingletonScope();

// services
container.bind(Env).toSelf().inSingletonScope();
container.bind(Http).toSelf().inSingletonScope();
container.bind(Notice).toSelf().inSingletonScope();
container.bind(SysService).toSelf().inSingletonScope();
container.bind(AuthService).toSelf().inSingletonScope();
container.bind(Persistent).toSelf().inSingletonScope();

const env = container.get(Env);
if (env.mock) {
  container.bind(MockStorage).toSelf().inSingletonScope();
  container.bind(AxiosMockerToken).to(Mocker).inSingletonScope();
}

const {containerManager, ProvideProps, InjectProps} = createPropsDecorators(container);

export {
  containerManager,
  ProvideProps,
  InjectProps,
};

action$.pipe(filter(act => String(act.type) !== 'Symbol(@@INIT)')).subscribe(act => {
  const type = String(act.type);
  const typeNameMatch = type.match(/Symbol\((.*)\)/);
  console.groupCollapsed(`[ACTION] ${typeNameMatch ? typeNameMatch[1] : type}`);
  console.log(act.payload);
  console.groupEnd();
});
