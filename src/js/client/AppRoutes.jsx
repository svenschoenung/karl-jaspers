import React from 'react';

import {
  Router, Route, IndexRoute, IndexLink, Link, hashHistory, browserHistory
} from 'react-router';

import 'whatwg-fetch';

import Home from './Home.jsx';
import Works from './Works.jsx';
import Work from './Work.jsx';
import Editions from './Editions.jsx';
import EditionVariants from './EditionVariants.jsx';
import Edition from './Edition.jsx';

import App from './App.jsx';

class AppRoutes extends React.Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="/werke" component={Works}/>
          <Route path="/werke/:workId" component={Work}/>
          <Route path="/ausgaben" component={Editions}/>
          <Route path="/ausgaben/:editionName" component={EditionVariants}/>
          <Route path="/ausgaben/:editionName/:editionYear" component={Edition}/>
          <Route path="/ausgaben/:editionName/:editionYear/:editionNum" component={Edition}/>
        </Route>
      </Router>
    );
  }
}

export default AppRoutes;
