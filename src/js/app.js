
class TableButton extends React.Component {
  render() {
    return (
      <div className="table-button">
        {this.props.name}
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
