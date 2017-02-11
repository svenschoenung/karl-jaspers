import React from 'react';

export default class SmallHeaderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: '' };
    this.setHeaderSize = props.setHeaderSize;
  }

  componentDidMount() {
    this.setHeaderSize('small');
  }
}
