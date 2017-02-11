import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

export default class Header extends React.Component {
  render() {
    return (
      <header className={this.props.size}>
        <h1>
        <Link to="/" aria-label="Zur Startseite">
        <img alt="Karl Jaspers" src={'/' + data.images['karl-jaspers']}/>
        </Link>
        </h1>
      </header>
    );
  }
}
