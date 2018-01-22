import React, { Component } from 'react';
import Board from './App';

class Square extends Component {
  handleClick() {
    
  }

  render(){
    return(<td onClick = {this.handleClick()}></td>);
  }
}

export default Square;
