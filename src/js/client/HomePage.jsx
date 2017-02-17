import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import HomeButton from './HomeButton.jsx';

import data from '../data.json';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
    this.setHeaderSize = props.setHeaderSize;
  }

  componentDidMount() {
    this.setHeaderSize('big');
  }

  render() {
    return (
        <main className="home">
          <Helmet title={'Karl Jaspers'}/>
          <nav className="home-buttons">
          <HomeButton name="Werke" to="werke" label="Zeige Liste mit Karl Jaspers Werken"/>
          <HomeButton name="Ausgaben" to="ausgaben" label="Zeige Liste verschiedener Ausgaben von Karl Jaspers Werken"/>
          </nav>
          <nav className="home-links">
          <Link to="/ueber/">&Uuml;ber diese Seite</Link>
          <span>&#x25a0;</span>
          <Link to="/kontakt/">Kontakt</Link>
          <span>&#x25a0;</span>
          <Link to="/rechtliches/">Rechtliches</Link>
          </nav>
        </main>
    );
  }
}
