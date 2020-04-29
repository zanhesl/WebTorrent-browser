import React from 'react';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import App from './App';
import StreamPage from './StreamPage';

function AppRouter() {
  return (
    <div className="main-router">
      <Router>
        <Link to="/stream">Meem</Link>
        <Link to="/">App</Link>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/stream" component={StreamPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default AppRouter;
