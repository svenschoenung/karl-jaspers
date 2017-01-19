var data = {/*DATA*/};

function getYearForWork(work) {
 var years = work.publishedIn
   .map((edition) => edition.replace(/.*\//, ''))
   .map((year) => parseInt(year));
 return Math.min.apply(Math, years);
}

var worksByYear = Object.keys(data.works)
 .map((id) => { data.works[id].id = id; return data.works[id]; })
 .map((work) => { work.year = getYearForWork(work); return work; })
 .sort((work1, work2) => work1.year - work2.year);

var editionsByYear = Object.keys(data.editions)
 .map((id) => { data.editions[id].id = id; return data.editions[id]; })
 .sort((edition1, edition2) => edition1.year - edition2.year);
 
function containsSearchTerm(object, term, keys) {
  var lowerCaseTerm = term.toLowerCase();
  return Object.keys(object)
   .filter((key) => keys.indexOf(key) >= 0)
   .map((key) => object[key].toString().toLowerCase())
   .filter((val) => val.indexOf(lowerCaseTerm) >= 0)
   .length > 0;
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
          worksByYear
            .filter((work) => containsSearchTerm(work, this.state.search, ['year', 'type', 'title']))
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
        <ul className="publishedIn">
        {
          work.publishedIn.map((editionId) => data.editions[editionId])
            .sort((edition1, edition2) => edition1.year - edition2.year)
            .map((edition) => 
              <li>
<Link to={'ausgaben/' + edition.id}>
<img alt="Cover" src={'bilder/werke/' + edition.id + '.png'}/><div><span className="title">{edition.title} ({edition.year})</span><br/>{edition.pages} Seiten, {edition.publisher}</div></Link></li>
            )
        }
        </ul>
        </article>
      </main> 
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
          editionsByYear
            .filter((edition) => containsSearchTerm(edition, this.state.search, ['year', 'type', 'title']))
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

class Edition extends SmallHeaderComponent {
  constructor(props) {
    super(props);
  }
 
  render() {
    var editionName = this.props.params.editionName;
    var editionYear = this.props.params.editionYear;
    var editionId = editionName + '/' + editionYear;
    var edition = data.editions[editionId];
    return (
      <main className="edition">
        <article>
        <h2>{edition.title}</h2>
        <div className="meta">Jahr: {edition.year}</div>
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
          <Route path="/ausgaben/:editionName/:editionYear" component={Edition}/>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<AppRoutes/>, document.getElementById('app'));
