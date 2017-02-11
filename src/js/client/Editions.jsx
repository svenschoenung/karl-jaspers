import React from 'react';
import { Link } from 'react-router';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import SearchableList from './SearchableList.jsx';

import { editionDesc } from './util.js';
import data from '../data.json';

class Editions extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="editions">
        <SearchableList
          listItems={data.editionsByYearAndTitle.map(id => data.editions[id])}
          searchPlaceholder="Ausgaben durchsuchen"
          searchFields={['year', 'title']}
          renderItem={(edition) =>
            <li key={edition.id}>
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
          } />
      </main>
    );
  }
}

export default Editions;
