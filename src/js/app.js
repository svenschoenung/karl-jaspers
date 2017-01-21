var data = {/*DATA*/};

function isSearchMatch(term, props) {
  var lowerCaseTerm = term.toLowerCase();
  return (object) => {
    return Object.keys(object)
      .filter((prop) => props.indexOf(prop) >= 0)
      .map((prop) => object[prop].toString().toLowerCase())
      .filter((val) => val.indexOf(lowerCaseTerm) >= 0)
      .length > 0;
  }
}

class Header extends React.Component {
  render() {
    return (
      <header className={this.props.size}>
        <h1>
        <Link to="/" aria-label="Zur Startseite">
        <img alt="Karl Jaspers" src="/imgs/karl-jaspers.svg"/>
        </Link>
        </h1>
      </header>
    );
  }
}

class HomeButton extends React.Component {
  render() {
    return (
      <Link to={this.props.to} aria-label={this.props.label}>
      <div className="home-button" aria-hidden="true">
        <img src={'/imgs/' + this.props.to + '.png'} role="button"/>
        <h2>{this.props.name}</h2>
      </div>
      </Link>
    )
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
    this.setHeaderSize = props.setHeaderSize;
  }

  componentDidMount() {
    this.setHeaderSize('big');
  }

  render() {
    return (
        <main className="home">
          <nav className="home-buttons">
          <HomeButton name="Werke" to="werke" label="Zeige Liste mit Karl Jaspers Werken"/>
          <HomeButton name="Ausgaben" to="ausgaben" label="Zeige Liste verschiedener Ausgaben von Karl Jaspers Werken"/>
          </nav>
        </main>
    );
  }
}


class SmallHeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
    this.handleChange = this.handleChange.bind(this);
    this.setHeaderSize = props.setHeaderSize;
  }

  componentDidMount() {
    this.setHeaderSize('small');
  }

  handleChange(evt) {
    this.setState({ search: evt.target.value });
  }
}

class Works extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <main className="works">
        <div className="search">
          <input type="text" placeholder="Werke durchsuchen"
                 value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="list">
        <ol>
        {
          data.worksByYear
            .map((workId) => data.works[workId])
            .filter(isSearchMatch(this.state.search, ['year', 'title']))
            .map((work) => (
              <li> 
              <Link to={'/werke/' + work.id}>
              <span className="year">{work.year}</span> 
              <span className="title">{work.title}</span>
              </Link>
              </li>
            ))
        }
        </ol>
        </div>
      </main>
    );
  }
}

class Work extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    fetch('/werke/' + this.props.params.workId + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({content: json.content}));
  }

  render() {
    var work = data.works[this.props.params.workId];
    return (
      <main className="work">
        <nav className="breadcrumb"><Link to="/werke">Werke</Link> &gt; {work.title}</nav>
        <article>
        <h2>{work.title}</h2>
        <div className="meta">Erstver&ouml;ffentlichung: {work.year}</div>
        <div dangerouslySetInnerHTML={{__html: this.state.content}} />
        <h3>Ver&ouml;ffentlicht in </h3>
        <EditionList editions={work.publishedIn}/>
        </article>
      </main> 
    );
  }
}

class EditionList extends React.Component {

  render() {
    return (
      <ul className="edition-list">
        {
          this.props.editions.map((editionId) => data.editions[editionId])
            .sort((edition1, edition2) => edition1.year - edition2.year)
            .map((edition) => 
              <li>
              <Link to={'/ausgaben/' + edition.id}>
              <img alt="Cover" src={'/imgs/ausgaben/' + edition.name + '/' + edition.year + '.100px.jpg'}/>
              <div><span className="title">{edition.title} ({edition.year})</span><br/>{edition.pages} Seiten, {edition.publisher}</div>
              </Link>
              </li>
            )
        }
      </ul>
    );
  }
}

class Editions extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="editions list">
        <div className="search">
          <input type="text" placeholder="Ausgaben durchsuchen"
                 value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="list">
        <ol>
        {
          data.editionsByYear
            .map((editionId) => data.editions[editionId])
            .filter(isSearchMatch(this.state.search, ['year', 'title']))
            .map((edition) => (
              <li>
              <Link to={'/ausgaben/' + edition.id}>
              <span className="year">{edition.year}</span>
              <span className="title">{edition.title}</span>
              </Link>
              </li>
            ))
        }
        </ol>
        </div>
      </main>
    );
  }
}

class EditionVariants extends SmallHeaderComponent {
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


class Edition extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    fetch('/ausgaben/' + this.props.params.editionName + '/' +
          this.props.params.editionYear + '.json')
      .then((rsp) => rsp.json())
      .then((json) => this.setState({content: json.content}));
  }

  render() {
    var editionName = this.props.params.editionName;
    var editionYear = this.props.params.editionYear;
    var editionId = editionName + '/' + editionYear;
    var edition = data.editions[editionId];
    return (
      <main className="edition">
        <nav className="breadcrumb">
          <Link to="/ausgaben">Ausgaben</Link> &gt; <Link to={'/ausgaben/' + edition.name}>{edition.title}</Link> &gt; {edition.year} 
        </nav>
        <article>
        <h2>{edition.title}</h2>
        <a href={'/imgs/ausgaben/' + edition.name + '/' + edition.year + '.jpg'}>
        <img className="edition-preview" src={'/imgs/ausgaben/' + edition.name + '/' + edition.year + '.200px.jpg'}/>
        </a>
        <div className="info">
        {edition.year} <br/>
        {edition.publisher}
        <div dangerouslySetInnerHTML={{__html: this.state.notes}} />
        </div>
        <h3>Enthaltene Werke</h3>
        <h3>Externe Links</h3>
        <Link to={edition.dnb}>{edition.dnb}</Link>
        </article>
      </main> 
    );
  }
}



var {
  Router, Route, IndexRoute, IndexLink, Link,
  hashHistory, browserHistory
} = ReactRouter;

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { headerSize: '' };
    this.setHeaderSize = this.setHeaderSize.bind(this);
  }

  setHeaderSize(headerSize) {
    this.setState({ headerSize: headerSize });
  }
 
  render () {
    return (
      <div>
        <Header size={this.state.headerSize}/>
        <ReactCSSTransitionGroup
          component="div"
          className="page"
          transitionName="page-transition"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
        {
          React.cloneElement(this.props.children, {
            key: location.pathname,
            setHeaderSize: this.setHeaderSize
          })
        }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
} 

class AppRoutes extends React.Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="/werke" component={Works}/>
          <Route path="/werke/:workId" component={Work}/>
          <Route path="/ausgaben" component={Editions}/>
          <Route path="/ausgaben/:editionName" component={EditionVariants}/>
          <Route path="/ausgaben/:editionName/:editionYear" component={Edition}/>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<AppRoutes/>, document.getElementById('app'));
