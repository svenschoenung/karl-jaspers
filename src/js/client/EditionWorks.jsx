import React from 'react';
import { Link } from 'react-router';

import data from '../data.json';

export default class EditionWorks extends React.Component {
  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <div className="list">
        <ul>
        {
          this.props.workIds.map(workId => (
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
