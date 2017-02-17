import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

export default class WorkList extends React.Component {
  render() {
    if (!this.props.works || this.props.works.length == 0) {
      return null;
    }
    return (
      <div>
        <h3>{this.props.title}</h3>
        <div className="list">
        <ul>
        {
          this.props.works.map(workId => (
	        <li key={workId}> 
            <Link to={'/werke/' + workId}>
            <span className="letter">
              {data.works[workId].title.charAt(0)} 
            </span>
            <span className="title">
              {data.works[workId].title} 
              {' '}
              ({data.works[workId].year})
            </span>
            </Link>
            </li>
          ))
        }
        </ul>
        </div> 
      </div> 
    );
  }
}
