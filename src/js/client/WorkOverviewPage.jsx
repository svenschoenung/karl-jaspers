import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import SearchableList from './SearchableList.jsx';

import data from '../data.json';

export default class WorkOverviewPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <main className="works">
        <Helmet title={'Karl Jaspers: Werke'}/>
        <SearchableList
          listItems={data.worksByYearAndTitle.map(id => data.works[id])}
          searchPlaceholder="Werke durchsuchen"
          searchFields={['year', 'title']}
          renderItem={(work) =>
            <li key={work.id}> 
            <Link to={'/werke/' + work.id}>
            <span className="year">{work.year}</span> 
            <span>
              <span className="title">{work.title}</span>
              { (!work.source) ? null :
                <span className="excerpt">
                (Exzerpt aus: &laquo;{data.works[work.source[0]].title}&raquo;)
                </span>
              } 
            </span>
            </Link>
            </li>
          } />
      </main>
    );
  }
}
