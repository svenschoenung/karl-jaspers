import React from 'react';
import { Link } from 'react-router';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionList from './EditionList.jsx';

import data from '../data.json';

export default class EditionVariantPage extends SmallHeaderPage {
  constructor(props) {
    super(props);
  }

  render() {
    var editionIds = data.editionsByName[this.props.params.editionName];
    var editions = editionIds.map((editionId) => data.editions[editionId]);
    return (
     <main className="editions-variants">
       <nav className="breadcrumb">
         <Link to="/ausgaben">Ausgaben</Link> &gt; {editions[0].title} 
       </nav>
       <article>
       <h3>Auflagen</h3>
       <EditionList editions={editionIds}/>
       </article>
     </main>
    );
  }
}
