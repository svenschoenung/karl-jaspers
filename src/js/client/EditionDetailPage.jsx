import React from 'react';
import { Link } from 'react-router';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionPreview from './EditionPreview.jsx';

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
    var l = (edition, key, desc) =>
      edition.links[key].map(url => ({ url: url, desc: desc, type: key }));

    var editionName = this.props.params.editionName;
    var editionYear = this.props.params.editionYear;
    var editionId = editionPath(this.props.params);
    var edition = data.editions[editionId];
    var links = Object.keys(edition.links || {})
      .map(key => (
        (key == 'dnb') ? l(edition, key, 'Deutsche Nationalbibliothek') :
        (key == 'google') ? l(edition, key, 'Google Books') :
        (key == 'scribd') ? l(edition, key, 'Scribd') :
        (key == 'openlib') ? l(edition, key, 'Open Library') : 
        (key == 'jstor') ? l(edition, key, 'JSTOR') : 
        (key == 'springer') ? l(edition, key, 'Springer Link') : []
      ));
    links = [].concat.apply([], links)
      .sort((a,b) => a.desc.localeCompare(b.desc));

    return (
      <main className="edition">
        <nav className="breadcrumb">
          <Link to={'/ausgaben'}>Ausgaben</Link> 
          {' > '}
          <Link to={'/ausgaben/' + edition.name}>{edition.title}</Link>
          {' > '}
          {edition.year} 
        </nav>
        <article>
        <h2>{edition.title}</h2>
        {(edition.subtitle) ? <h4>{edition.subtitle}</h4> : null}
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
        <h3>Enthaltene Werke</h3>
        <div className="list">
        <ul>
        {
          edition.works.map((workId) => (
	    <li> 
            <Link to={'/werke/' + workId}>
            <span className="letter">{data.works[workId].title.charAt(0)}</span>
            <span className="title">{data.works[workId].title} ({data.works[workId].year})</span>
            </Link>
            </li>
          ))
        }
        </ul>
        </div>
        { (links.length == 0) ? null : 
        <div className="list">
        <h3>Externe Links</h3>
        <ul>
        {
          links.map((link) => (
	    <li> 
            <a href={link.url}>
            <span className="icon"><img src={'/links/' + data.linkImages[link.type]}/></span>
            <span className="title">{link.desc}</span>
            </a>
            </li>
          ))
        }
        </ul>
        </div>
        }
        </article>
      </main> 
    );
  }
}
