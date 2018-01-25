import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Board from './Board'

class App extends Component {

  render(){
    return(
      <div>
        <Board boardSize={10} maxShots={50} />
      </div>
    );
  }

}
export default App;
