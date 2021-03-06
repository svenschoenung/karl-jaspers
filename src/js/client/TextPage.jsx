import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import SmallHeaderPage from './SmallHeaderPage.jsx';

export default class TextPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();

    var path = this.props.location.pathname;
    path = path.replace(/\/$/, '').replace(/^\//, '');

    fetch('/' + path + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({text: json}));
  }

  render() {
    return (
      <main className="text">
        <Helmet title={'Karl Jaspers: ' + (this.state.text || {}).title}/>
        <article>
        <h2 dangerouslySetInnerHTML={{__html: (this.state.text || {}).title}}/>
        <div dangerouslySetInnerHTML={{__html: (this.state.text || {}).body}}/>
        </article>
      </main> 
    );
  }
}
