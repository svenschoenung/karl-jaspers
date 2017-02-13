import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

var linkDescs = {
  dnb: () => 'Deutsche Nationalbibliothek',
  google: () => 'Google Books',
  scribd: () => 'Scribd',
  openlib: () => 'Open Library',
  jstor: () => 'JSTOR',
  springer: () => 'Springer Link',
  wiki: (l) => 'Wikipedia: ' + l.url.replace(/.*\//, '').replace(/_/g, ' ')
};

export default class ExternalLinks extends React.Component {
  render() {
    var links = [];
    Object.keys(this.props.links || {}).forEach(type => {
      this.props.links[type].forEach(url => {
        var link = { type: type, url: url };
        link.desc = linkDescs[type](link);
        links.push(link)
      });
    });
    links = links.sort((link1, link2) => link1.desc.localeCompare(link2.desc));

    if (links.length == 0) {
      return null;
    }
    return (
      <div className="list">
        <h3>{this.props.title}</h3>
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
