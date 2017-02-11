import React from 'react';
import { Link } from 'react-router';

function isMatch(term, props) {
  var lowerCaseTerm = term.toLowerCase();
  return (object) => {
    return Object.keys(object)
      .filter((prop) => props.indexOf(prop) >= 0)
      .map((prop) => object[prop].toString().toLowerCase())
      .filter((val) => val.indexOf(lowerCaseTerm) >= 0)
      .length > 0;
  }
}

export default class SearchableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
  }

  changeSearchTerm(evt) {
    this.setState({ searchTerm: evt.target.value });
  }

  render() {
    return (
      <div>
        <div className="search">
           <input type="text"
                  placeholder={this.props.searchPlaceholder}
                  value={this.state.searchTerm}
                  onChange={this.changeSearchTerm.bind(this)} />
        </div>
        <div className="overview">
        <ul>
        {
          this.props.listItems
            .filter(isMatch(this.state.searchTerm, this.props.searchFields))
            .map(listItem => this.props.renderItem(listItem))
        }
        </ul>
        </div>
      </div>
    );
  }
}
