import React from 'react';
import { Link } from 'react-router';

import SmallHeaderComponent from './SmallHeaderComponent.jsx';
import { isSearchMatch, editionDesc } from './util.js';
import data from '../data.json';

class Editions extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="editions">
        <div className="search">
          <input type="text" placeholder="Ausgaben durchsuchen"
                 value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="overview">
        <ul>
        {
          data.editionsByYearAndTitle
            .map((editionId) => data.editions[editionId])
            .filter(isSearchMatch(this.state.search, ['year', 'title', 'publisher']))
            .map((edition) => (
              <li>
              <Link to={'/ausgaben/' + edition.id}>
              <span className="year">{edition.year}</span>
              <span>
              <span className="title">{edition.title}.</span>
              <span className="variant">
              <span className="publisher">{edition.publisher}</span>
              <span className="editionno">, {editionDesc(edition, '') || ''}</span>
              </span>
              </span>
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

export default Editions;
