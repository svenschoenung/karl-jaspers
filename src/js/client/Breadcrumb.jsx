import React from 'react';
import { Link } from 'react-router';

export default class Breadcrumb extends React.Component {
  render() {
    var crumbs = [];
    this.props.labels.forEach((label, i) => {
      if (this.props.links[i]) {
        crumbs.push(<Link key={i*2} to={this.props.links[i]}>{label}</Link>);
      } else {
        crumbs.push(<span key={i*2}>{label}</span>);
      }
      if (i < this.props.labels.length - 1) {
        crumbs.push(<span key={i*2+1}>{' > '}</span>);
      }
    }); 

    return <nav className="breadcrumb">{crumbs}</nav>;
  }
}
