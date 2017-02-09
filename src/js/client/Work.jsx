import React from 'react';
import { Link } from 'react-router';

import SmallHeaderComponent from './SmallHeaderComponent.jsx';
import EditionList from './EditionList.jsx';
import data from '../data.json';

class Work extends SmallHeaderComponent {
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
        <nav className="breadcrumb"><Link to="/werke">Werke</Link> &gt; {work.title}</nav>
        <article>
        <h2>{work.title}</h2>
        {(work.subtitle) ? <h4>{work.subtitle}</h4> : null}
        <div className="meta">Erstver&ouml;ffentlichung: {work.year}</div>
        <div dangerouslySetInnerHTML={{__html: this.state.desc}} />
        <h3>Ver&ouml;ffentlicht in </h3>
        <EditionList editions={work.editions}/>
        </article>
      </main> 
    );
  }
}

export default Work;
