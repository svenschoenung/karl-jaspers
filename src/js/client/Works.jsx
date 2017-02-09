import React from 'react';
import { Link } from 'react-router';

import SmallHeaderComponent from './SmallHeaderComponent.jsx';
import { isSearchMatch } from './util.js';
import data from '../data.json';

class Works extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <main className="works">
        <div className="search">
          <input type="text" placeholder="Werke durchsuchen"
                 value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="overview">
        <ul>
        {
          data.worksByYearAndTitle
            .map((workId) => data.works[workId])
            .filter(isSearchMatch(this.state.search, ['year', 'title']))
            .map((work) => (
              <li> 
              <Link to={'/werke/' + work.id}>
              <span className="year">{work.year}</span> 
              <span className="title">{work.title}</span>
              </Link>
              </li>
            ))
        }
        </ul>
        </div>
      </main>
    );
  }
}

export default Works;
