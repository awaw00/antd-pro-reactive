import { ActionType, AsyncActionType, asyncTypeDef, RxStore, typeDef } from '@awaw00/rxstore';
import produce from 'immer';

export interface ModalState {
  visible: boolean;
  title: string;
  contentLoading: boolean;
}

export interface ShowModalConfig {
  title?: string;
}

export class ModalStore extends RxStore<ModalState> {
  @typeDef() public SHOW!: ActionType;
  @typeDef() public HIDE!: ActionType;
  @asyncTypeDef() public LOADING!: AsyncActionType;

  public show = (config?: ShowModalConfig) => this.action({
    type: this.SHOW,
    payload: config
  });

  public hide = () => this.action({
    type: this.HIDE
  });

  public startLoading = () => this.action({
    type: this.LOADING.START
  });

  public endLoading = () => this.action({
    type: this.LOADING.END
  });

  public storeInit (initialState?: ModalState) {
    this.init({
      initialState: initialState || {
        visible: false,
        title: '',
        contentLoading: false,
      },
      reducer: (state, {type, payload}) => produce(state, d => {
        switch (type) {
          case this.SHOW: {
            if (payload && payload.title) {
              d.title = payload.title;
            }
            d.visible = true;
            break;
          }
          case this.HIDE:
            d.visible = false;
            break;
          case this.LOADING.START:
            d.contentLoading = true;
            break;
          case this.LOADING.END:
          case this.LOADING.ERR:
            d.contentLoading = false;
            break;
        }
      }),
    });
  }
}
