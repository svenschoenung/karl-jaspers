import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';
import { editionDesc } from './util.js';

export default class EditionList extends React.Component {
  render() {
    return (
      <ul className="edition-list">
        {
          this.props.editions.map((editionId) => data.editions[editionId])
            .sort((edition1, edition2) => edition1.year - edition2.year)
            .map((edition) => 
              <li>
              <Link to={'/ausgaben/' + edition.id}>
              <div>
              { (edition.images[0]) ?
                <img alt="Cover" src={'/ausgaben/' + edition.id + '/' + edition.images[0][100] }/> :
                <div className="missing-cover">?</div>
              }
              </div>
              <div>
              <div className="title">{edition.title} ({edition.year})</div>
              <div>{editionDesc(edition) || edition.series || ''}, {edition.pages} Seiten, {edition.publisher}</div>
              </div>
              </Link>
              </li>
            )
        }
      </ul>
    );
  }
}
