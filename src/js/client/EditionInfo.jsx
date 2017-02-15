import React from 'react';

import EditionDesc from './EditionDesc.jsx';

export default class EditionInfo extends React.Component {
  render() {
    var edition = this.props.edition;
    return (
      <div className="info">
        <div className="info-group">
        <h4>Veröffentlichung</h4>
        <div>
          <EditionDesc edition={edition} delim=", " trailingDelim={true}/>
          {edition.year}
        </div>
        <div>
          {edition.publisher}
          {(edition.publisher_city) ? ' (' + edition.publisher_city + ')': null}
        </div>
        </div>

        <div className="info-group">
        <h4>Umfang</h4>
        <div>{edition.pages} Seiten</div>
        </div>

	{(!edition.series) ? null :
          <div className="info-group">
          <h4>Reihe</h4>
          <div>{edition.series}</div>
          </div>
        }

	{(!edition.notes) ? null :
          <div className="info-group">
          <h4>Anmerkungen</h4>
          <div dangerouslySetInnerHTML={{__html: edition.notes}} />
          </div>
        }
      </div>
    );
  }
}
