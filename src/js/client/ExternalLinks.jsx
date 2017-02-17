import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

function esc(text) {
  return encodeURIComponent(text.replace(/\(.*\)/, ''));
}

var linkTypes = {
  scribd: (ids) => ids.map(id => ({
    desc: 'Scribd', 
    url: 'https://www.scribd.com/doc/' + id
  })),
  jstor: (ids) => ids.map(id => ({
    desc: 'JSTOR',
    url: 'https://www.jstor.org/stable/' + id
  })),
  springer: (ids) => ids.map(id => ({
    desc: 'Springer Link',
    url: 'http://link.springer.com/book/' + id
  })),
  archive: (ids) => ids.map(id => ({
    desc: 'Internet Archive',
    url: 'https://archive.org/details/' + id
  })),
  dnb: (ids, e) => [{
    desc: 'Deutsche Nationalbibliothek',
    url: 'https://portal.dnb.de/opac.htm?query=' +
      esc('tit="' + e.title + '"') + '+and+' +
      esc('per="Karl Jaspers"') + '+and+' +
      esc('jhr=' + e.year) + '&method=simpleSearch&cqlMode=true',
    button: ids[0] && ({
      url: 'http://d-nb.info/' + ids[0],
      desc: '(DE-101)' + ids[0] 
    })
  }],
  google: (ids, e) => [{
    desc: 'Google Books',
    url: 'https://www.google.de/search?lr=lang_de&tbm=bks&q=' +
      esc('intitle:"' + e.title + '"') + '+' +
      esc('inauthor:"Karl Jaspers"') + '&tbs=' +
      esc('cdr:1,cd_min:' + e.year + ',cd_max:' + e.year),
    button: ids[0] && ({
      url: 'https://books.google.de/books?id=' + ids[0],
      desc: ids[0]
    })
  }],
  openlib: (ids, e) => [{
    desc: 'Open Library',
    url: 'https://openlibrary.org/search?q=' +
      esc('title:"' + e.title + '"') + '+' +
      esc('author:"Karl Jaspers"'),
    button: ids[0] && ({
      url: 'https://openlibrary.org/books/' + ids[0],
      desc: ids[0]
    })
  }],
  worldcat: (ids, e) => [{
    desc: 'OCLC WorldCat',
    url: 'http://www.worldcat.org/search?q=' +
      esc('ti:' + e.title) + '+' +
      esc('au:Karl Jaspers') + '&fq=' +
      esc('yr:' + e.year + '..' + e.year) + '+ln:ger',
    button: ids[0] && ({
      url: 'http://www.worldcat.org/oclc/' + ids[0],
      desc: '(OCoLC)' + ids[0]
    })
  }],
  wiki: (ids) => ids.map(id => ({
    url: 'https://de.wikipedia.org/wiki/' + id.replace(/ /, '_'),
    desc: 'Wikipedia: ' + id
  }))
};

export default class ExternalLinks extends React.Component {
  render() {
    var obj = this.props.for;
    var links = [];

    this.props.types.forEach(type => {
      var linkUrls = (obj.links && obj.links[type]) || []
      linkTypes[type](linkUrls, obj).forEach(link => {
        link.type = type;
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
              <a href={link.url} target="_blank">
                <span className="icon">
                  <img src={'/links/' + data.linkImages[link.type]}/>
                </span>
                <span className="title">{link.desc}</span>
              </a>
              {link.button && 
                <a className="search-link" target="_blank"
                   href={link.button.url}>{link.button.desc}</a>}
            </li>
          ))
        }
        </ul>
      </div>
    );
  }
}
