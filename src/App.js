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
      boardSize: 10,
      redirect: false
    }
  }

  handleChange(e){
    this.setState({name: e.target.value})
  }

  getSize(e){
    this.setState({boardSize: e.target.value})
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
        <div className="homePage">

          <Route exact path="/" render={props => (
            <div>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label>
                Name:&nbsp;
                <input type="text" value={this.state.name} onChange={this.handleChange.bind(this)} className="inputName"/>
              </label>
              <br />
              <br />
              <label>
                Board size:&nbsp;
                <select name="size" onChange={this.getSize.bind(this)} className="dropDown">
                  <option value="10">-Select Size-</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </label>
              <br />
              <br />
              <input type="submit" value="Start Game!" className="button"/>
            </form>
            { redirect && (<Redirect to='/board'/>) }
            </div>
          )} />

          <Route exact path="/board" render={props => (
            <div>
              <h1>{name}&rsquo;s Game</h1>
              <Board boardSize={this.state.boardSize} maxShots={5} />
              <button
                    className="button"
                    onClick={this.newUser.bind(this)}
                    ><span>Home</span></button>

              { !redirect && (<Redirect to='/'/>) }
            </div>
          )} />
        </div>
      </Router>
    );
  }

}
export default App;
