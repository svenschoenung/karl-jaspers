import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

export default class HomeButton extends React.Component {
  render() {
    return (
      <Link to={this.props.to} aria-label={this.props.label}>
      <div className="home-button" aria-hidden="true">
        <img src={'/' + data.images[this.props.to]} role="button"/>
        <h2>{this.props.name}</h2>
      </div>
      </Link>
    )
  }
}
