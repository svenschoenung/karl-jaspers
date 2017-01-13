
class TableButton extends React.Component {
  render() {
    return (
      <div className="table-button">
        <h2>{this.props.name}<h2>
        {this.props.desc}
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <main>
          <div className="table-buttons">
          <TableButton name="Works" desc=""/>
          <TableButton name="Publications" desc=""/>
          </div>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
