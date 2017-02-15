import React from 'react';
import { Link } from 'react-router';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionPreview from './EditionPreview.jsx';
import EditionInfo from './EditionInfo.jsx';
import WorkList from './WorkList.jsx';
import ExternalLinks from './ExternalLinks.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import Title from './Title.jsx';

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
    this.state = {edition: {}};
  }

  componentDidMount() {
    super.componentDidMount();

    fetch('/ausgaben/' + editionPath(this.props.params) + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({edition: json}));
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
        <EditionInfo edition={Object.assign(edition, this.state.edition)}/>
        <WorkList title="Enthaltene Werke" workIds={edition.works}/>
        <ExternalLinks title="Externe Links" links={edition.links}/>
        </article>
      </main> 
    );
  }
}
