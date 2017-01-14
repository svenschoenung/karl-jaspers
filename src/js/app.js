class Header extends React.Component {
  render() {
    return (
      <header className={this.props.type}>
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
  render() {
    return (
        <main>
          <div className="home-buttons">
          <HomeButton name="Werke" to="werke"/>
          <HomeButton name="Ausgaben" to="ausgaben"/>
          </div>
        </main>
    );
  }
}

class Works extends React.Component {
  render() {
    return (
        <main>Werke</main>
    );
  }
}

class Editions extends React.Component {
  render() {
    return (
        <main>Ausgaben</main>
    );
  }
}

var {
  Router, Route, IndexRoute, IndexLink, Link,
  hashHistory, browserHistory
} = ReactRouter;

class App extends React.Component {
  render () {
    return (
      <div>
        <Header/>
        {this.props.children}
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
