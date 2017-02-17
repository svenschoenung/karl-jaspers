import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import SearchableList from './SearchableList.jsx';
import EditionDesc from './EditionDesc.jsx';

import data from '../data.json';

export default class EditionOverviewPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="editions">
        <Helmet title={'Karl Jaspers: Ausgaben'}/>
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
            <span className="editionno">
            {', '}
            <EditionDesc edition={edition} delim=", " series={true}/>
            </span>
            </span>
            </span>
            </Link>
            </li>
          } />
      </main>
    );
  }
}
