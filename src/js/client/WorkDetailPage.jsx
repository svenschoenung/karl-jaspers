import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionList from './EditionList.jsx';
import WorkList from './WorkList.jsx';
import ExternalLinks from './ExternalLinks.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import Title from './Title.jsx';

import data from '../data.json';

export default class WorkDetailPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    fetch('/werke/' + this.props.params.workId + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({desc: json.desc}));
  }

  render() {
    var work = data.works[this.props.params.workId];
    return (
      <main className="work">
        <Helmet title={'Karl Jaspers: ' + work.title}/>
        <Breadcrumb links={['/werke']} labels={['Werke', work.title]}/>
        <article>
        <Title for={work}/>
        <div className="meta">Erstver&ouml;ffentlichung: {work.year}</div>
        <div dangerouslySetInnerHTML={{__html: this.state.desc}} />
        <WorkList title="Exzerpt aus" works={work.source}/>
        <EditionList title="Veröffentlicht in" editions={work.editions}/>
        <ExternalLinks title="Externe Links" 
          for={work} types={['wiki']}/>
        </article>
      </main> 
    );
  }
}
