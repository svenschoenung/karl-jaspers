import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Header from './Header.jsx';

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

export default App;
