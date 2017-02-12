import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

var linkDescs = {
  dnb: 'Deutsche Nationalbibliothek',
  google: 'Google Books',
  scribd: 'Scribd',
  openlib: 'Open Library',
  jstor: 'JSTOR',
  springer: 'Springer Link'
};

export default class EditionLinks extends React.Component {
  render() {
    var links = [];
    Object.keys(this.props.links || {}).forEach(type => 
      this.props.links[type].forEach(url => links.push({
        type: type,
        url: url,
        desc: linkDescs[type]
      }))
    );
    links = links.sort((link1, link2) => link1.desc.localeCompare(link2.desc));

    if (links.length == 0) {
      return null;
    }
    return (
      <div className="list">
        <h3>Externe Links</h3>
        <ul>
        {
          links.map(link => (
  	      <li key={link.url}> 
              <a href={link.url}>
                <span className="icon">
                  <img src={'/links/' + data.linkImages[link.type]}/>
                </span>
                <span className="title">{link.desc}</span>
              </a>
            </li>
          ))
        }
        </ul>
      </div>
    );
  }
}
