import React from 'react';
import { Link } from 'react-router';

import SmallHeaderComponent from './SmallHeaderComponent.jsx';
import SearchableList from './SearchableList.jsx';

import data from '../data.json';

export default class Works extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <main className="works">
        <SearchableList
          listItems={data.worksByYearAndTitle.map(id => data.works[id])}
          searchPlaceholder="Werke durchsuchen"
          searchFields={['year', 'title']}
          renderItem={(work) =>
            <li key={work.id}> 
            <Link to={'/werke/' + work.id}>
            <span className="year">{work.year}</span> 
            <span className="title">{work.title}</span>
            </Link>
            </li>
          } />
      </main>
    );
  }
}
