import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';
import { editionDesc } from './util.js';

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
              <div className="title">{edition.title} ({edition.year})</div>
              <div>
                {editionDesc(edition) || edition.series || ''}
                , {edition.pages} Seiten
                , {edition.publisher}
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
