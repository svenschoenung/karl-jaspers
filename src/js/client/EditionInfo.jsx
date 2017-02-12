import React from 'react';

import { editionDesc } from './util.js';

export default class EditionInfo extends React.Component {
  render() {
    var edition = this.props.edition;
    return (
      <div className="info">
        {editionDesc(edition, ',') || ''} {edition.year} <br/>
        {edition.publisher}
        {(edition.publisher_city) ? ' (' + edition.publisher_city + ')': null}
        <br/>
        <br/>
        {edition.pages} Seiten
	{(edition.series) ? <br/> : null}
	{(edition.series) ? <br/> : null}
	{(edition.series) ? edition.series : null}
        <div dangerouslySetInnerHTML={{__html: this.props.edition.notes}} />
      </div>
    );
  }
}
