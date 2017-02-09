import React from 'react';

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

export default SmallHeaderComponent;
