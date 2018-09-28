import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { MainLayout } from '@/layouts/MainLayout';
import { Exception404 } from '@/pages/Exception/404';
import { InjectProps } from '@/ioc';
import { History } from '@/interfaces';
import { HistoryToken } from '@/ioc/tokens';

interface Props {
  history?: History;
}

@InjectProps({
  history: HistoryToken,
})
class App extends React.Component<Props> {
  public render () {
    return (
      <Router history={this.props.history!}>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route>
            <MainLayout>
              <Switch>
                <Route path="/a" render={() => <div>a</div>}/>
                <Route path="/dashboard" render={() => <div>dashboard</div>}/>
                <Route path="/" exact={true} render={() => <Redirect to="/dashboard"/>}/>
                <Route component={Exception404}/>
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
