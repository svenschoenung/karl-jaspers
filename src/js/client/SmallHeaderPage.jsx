import React from 'react';

export default class SmallHeaderPage extends React.Component {
  constructor(props) {
    super(props);
    this.setHeaderSize = props.setHeaderSize;
    this.state = { };
  }

  componentDidMount() {
    this.setHeaderSize('small');
  }
}
