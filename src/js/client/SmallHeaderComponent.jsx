import React from 'react';

class SmallHeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
    this.setHeaderSize = props.setHeaderSize;
  }

  componentDidMount() {
    this.setHeaderSize('small');
  }
}

export default SmallHeaderComponent;
