import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import SmallHeaderPage from './SmallHeaderPage.jsx';
import EditionList from './EditionList.jsx';
import Breadcrumb from './Breadcrumb.jsx';

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
       <Helmet title={'Karl Jaspers: ' + editions[0].title}/>
       <Breadcrumb
         links={['/ausgaben']} 
         labels={['Ausgaben', editions[0].title]} />
       <article>
       <EditionList title="Auflagen" editions={editionIds}/>
       </article>
     </main>
    );
  }
}
