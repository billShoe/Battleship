import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

import Board from './Board'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      name: 'Input Name',
      redirect: false
    }
  }

  handleChange(e){
    this.setState({name: e.target.value})
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({ redirect: true })
  }

  newUser(e){
    e.preventDefault();
    this.setState({ redirect: false })
  }

  render(){

    const { redirect, name } = this.state
//Button for username input and redirect once on board
    return(
      <Router>
        <div>

          <Route exact path="/" render={props => (
            <div>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label>
                Name:
                <input type="text" value={this.state.name} onChange={this.handleChange.bind(this)} />
              </label>
              <input type="submit" value="Submit" />
            </form>
            { redirect && (<Redirect to='/board'/>) }
            </div>
          )} />

          <Route exact path="/board" render={props => (
            <div>
              <h1>{name}'s Game</h1>
              <Board boardSize={10} maxShots={50} />
              <button onClick={this.newUser.bind(this)}>Home</button>
              { !redirect && (<Redirect to='/'/>) }
            </div>
          )} />
        </div>
      </Router>
    );
  }

}
export default App;
