import React from 'react';
import { Link } from 'react-router';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionPreview from './EditionPreview.jsx';
import EditionWorks from './EditionWorks.jsx';
import EditionLinks from './EditionLinks.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import Title from './Title.jsx';

import { editionDesc } from './util.js';
import data from '../data.json';

function editionPath(params) {
  var path = params.editionName
  path += '/' + params.editionYear;
  if (params.editionNum) {
    path += '/' + params.editionNum;
  }
  return path;
}

export default class EditionDetailPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();

    fetch('/ausgaben/' + editionPath(this.props.params) + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({notes: json.notes}));
  }

  render() {
    var editionName = this.props.params.editionName;
    var editionYear = this.props.params.editionYear;
    var editionId = editionPath(this.props.params);
    var edition = data.editions[editionId];
    return (
      <main className="edition">
        <Breadcrumb
           links={['/ausgaben', '/ausgaben/' + edition.name]}
           labels={['Ausgaben', edition.title, edition.year]} />
        <article>
        <Title for={edition}/>
        <EditionPreview edition={edition}/>
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
        <div dangerouslySetInnerHTML={{__html: this.state.notes}} />
        </div>
        <EditionWorks title="Enthaltene Werke" workIds={edition.works}/>
        <EditionLinks title="Externe Links" links={edition.links}/>
        </article>
      </main> 
    );
  }
}
