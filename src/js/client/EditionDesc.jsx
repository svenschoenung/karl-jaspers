import React from 'react';

export default class EditionDesc extends React.Component {
  render() {
    var edition = this.props.edition;
    var desc = '';

console.log(edition);
    if (edition.edition_desc) {
       desc = edition.edition_desc;
    } else if (edition.edition) {
       desc = edition.edition + '. Auflage'; 
    } else if (this.props.series && edition.series) {
       desc = edition.series;
    }

    if (edition.copies_desc) {
      if (desc.length > 0) {
         desc += this.props.delim;
      }
      desc += edition.copies_desc;
    }

    if (this.props.trailingDelim) {
      if (desc.length > 0) {
         desc += this.props.delim;
      }
    }

    return <span>{desc}</span>;
  }
}
