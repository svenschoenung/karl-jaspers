import React from 'react';

import {
  Router, Route, IndexRoute, IndexLink, Link, hashHistory, browserHistory
} from 'react-router';

import 'whatwg-fetch';

import HomePage from './HomePage.jsx';
import WorkOverviewPage from './WorkOverviewPage.jsx';
import WorkDetailPage from './WorkDetailPage.jsx';
import EditionOverviewPage from './EditionOverviewPage.jsx';
import EditionVariantPage from './EditionVariantPage.jsx';
import EditionDetailPage from './EditionDetailPage.jsx';
import TextPage from './TextPage.jsx';

import App from './App.jsx';

export default class AppRoutes extends React.Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={HomePage}/>
          <Route path="/werke" component={WorkOverviewPage}/>
          <Route path="/werke/:workId" component={WorkDetailPage}/>
          <Route path="/ausgaben" component={EditionOverviewPage}/>
          <Route path="/ausgaben/:editionName" component={EditionVariantPage}/>
          <Route path="/ausgaben/:editionName/:editionYear" component={EditionDetailPage}/>
          <Route path="/ausgaben/:editionName/:editionYear/:editionNum" component={EditionDetailPage}/>
          <Route path="/ueber" component={TextPage}/>
          <Route path="/kontakt" component={TextPage}/>
          <Route path="/rechtliches" component={TextPage}/>
        </Route>
      </Router>
    );
  }
}
