import React from 'react';
import { Link } from 'react-router';

import EditionDesc from './EditionDesc.jsx';

import data from '../data.json';

export default class EditionList extends React.Component {
  render() {
    var cover = (ed) => '/ausgaben/' + ed.id + '/' + ed.images[0][100];
    return (
      <div>
      <h3>{this.props.title}</h3>
      <ul className="edition-list">
        {
          this.props.editions.map((editionId) => data.editions[editionId])
            .sort((edition1, edition2) => edition1.year - edition2.year)
            .map((edition) => 
              <li key={edition.id}>
              <Link to={'/ausgaben/' + edition.id}>
              <div>
              { 
                (edition.images[0]) ?
                <img alt="Cover" src={cover(edition)}/> :
                <div className="missing-cover">?</div>
              }
              </div>
              <div>
              <div className="title">
                <span className="aquo">&laquo;</span>
                {edition.title}
                <span className="aquo">&raquo;</span>
                {' (' + edition.year + ')'}
              </div>
              <div>
                <EditionDesc edition={edition} delim=", " series={true}/>
                , {edition.pages} Seiten, {edition.publisher}
              </div>
              </div>
              </Link>
              </li>
            )
        }
      </ul>
      </div>
    );
  }
}
