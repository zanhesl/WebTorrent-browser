import React from 'react';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import App from './App';
import MemoryStat from './MemoryStat';

function AppRouter() {
  return (
    <div className="main-router">
      <Router>
        <Link to="/memory">Meem</Link>
        <Link to="/">App</Link>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/memory" component={MemoryStat} />
        </Switch>
      </Router>
    </div>
  );
}

export default AppRouter;
