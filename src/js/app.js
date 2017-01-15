var data = {/*DATA*/};

function getYearForWork(work) {
 var years = work.publishedIn
   .map((edition) => edition.replace(/.*\//, ''))
   .map((year) => parseInt(year));
 return Math.min.apply(Math, years);
}

var worksByYear = Object.keys(data.works)
 .map((id) => data.works[id])
 .map((work) => { work.year = getYearForWork(work); return work })
 .sort((work1, work2) => work1.year - work2.year);

var editionsByYear = Object.keys(data.editions)
 .map((id) => data.editions[id])
 .sort((edition1, edition2) => edition1.year - edition2.year);
 
function containsSearchTerm(object, term, keys) {
  return Object.keys(object)
   .filter((key) => keys.indexOf(key) >= 0)
   .map((key) => object[key].toString().toLowerCase())
   .filter((val) => val.indexOf(term) >= 0)
   .length > 0;
}

class Header extends React.Component {
  render() {
    return (
      <header className={this.props.size}>
        <h1>
        <Link to="/">
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
      <Link to={this.props.to}>
      <div className="home-button">
        <img src={'/imgs/' + this.props.to + '.png'}/>
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
          <div className="home-buttons">
          <HomeButton name="Werke" to="werke"/>
          <HomeButton name="Ausgaben" to="ausgaben"/>
          </div>
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
        <table>
        {
          worksByYear
            .filter((work) => containsSearchTerm(work, this.state.search, ['year', 'type', 'title']))
            .map((work) => (
              <tr> 
               <td>{work.year}</td>
               <td>{work.type}</td>
               <td>{work.title}</td>
             </tr>
            ))
        }
        </table>
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
      <main className="editions">
        <div className="search">
          <input type="text" placeholder="Ausgaben durchsuchen"
                 value={this.state.value} onChange={this.handleChange} />
        </div>
        <table>
        {
          editionsByYear
            .filter((edition) => containsSearchTerm(edition, this.state.search, ['year', 'type', 'title']))
            .map((edition) => (
              <tr> 
               <td>{edition.year}</td>
               <td>{edition.type}</td>
               <td>{edition.title}</td>
             </tr>
            ))
        }
        </table>
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
          <Route path="/ausgaben" component={Editions}/>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<AppRoutes/>, document.getElementById('app'));
