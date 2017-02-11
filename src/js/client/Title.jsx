import React from 'react';

export default class Title extends React.Component {
  render() {
    return (
      <header>
        <h2>{this.props.for.title}</h2>
        {(this.props.for.subtitle) ? <h4>{this.props.for.subtitle}</h4> : null}
      </header>
    );
  }
}
