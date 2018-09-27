import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { InjectHistory } from '@/components/InjectHistory';
import { Login } from '@/pages/Login';
import { MainLayout } from '@/layouts/MainLayout';
import { Exception404 } from '@/pages/Exception/404';

class App extends React.Component {
  public render () {
    return (
      <BrowserRouter>
        <InjectHistory>
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
        </InjectHistory>
      </BrowserRouter>
    );
  }
}

export default App;
