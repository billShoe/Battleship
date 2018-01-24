import React, { Component } from 'react';

const EMPTY = 0
const SHIP = 1
const HIT = 2
const MISS = 3

class Board extends Component {
  constructor(props){
    super(props)
    //Maintain state for the entire game in your main component
    this.state = {
      board: this.getBoard(10),
      shots: 25,
      message: 'Take the shot!!!'
    }
  }

  //creates a board with however many squares we pass to the function
    getBoard(boardSize) {
      let board = []

      for (let row = 0 ; row < boardSize; row++) {
        board[row] = []
        for (let col = 0 ; col < boardSize; col++) {
          board[row][col] = EMPTY
        }
      }
      return board;
    }

  //loop create another for loop to create the <td> tags
  renderRow(rowNumber) {
    const { board } = this.state

    let row = []

    for(let i = 0;i < 10; i++) {
      // create single cell with id of coordinates
      // 0-0   3-5
      let className;

      switch (board[i][rowNumber]) {
        case MISS:
          className = 'miss'
          break;
        case HIT:
          className = 'hit'
          break;
        case SHIP:
          className = 'ship'
          break;
        default:
          className = 'blank'
      }

      row.push(<td
                  key={i + '-' +rowNumber}
                  id={i + '-' +rowNumber}
                  className={className}
                  onClick={this.handleClick.bind(this)}>
                  </td>)

    }
    return row;
  }

//Use a for loop to append to a table a <tr> tag
  renderRows(){
    let newBoard = []
    for(let i = 0; i < 10; i++) {
      newBoard.push(<tr key={i}>{this.renderRow(i)}</tr>)
    }
    return newBoard;
  }

//checks for ship on click, keeps track of shots taken
  handleClick(event) {
    var clickEvent = event.target.id;
    var pos = clickEvent.split("-");
    var x = pos[0];
    var y = pos[1];
    let newBoard = this.state.board;
    let newShots = this.state.shots;
    let newMessage = this.state.message;
    if (newBoard[x][y] === 0) {
      newBoard[x][y] = MISS;
      newShots--;
      newMessage = 'You missed!';
    }else if (newBoard[x][y] === 1) {
      newBoard[x][y] = HIT;
      newShots--;
      newMessage = 'You hit something!'
    }
    this.setState({
      board: newBoard,
      shots: newShots,
      message: newMessage,
    })
  }

  componentWillMount(){
    for(let i = 0;i < 5; i++){
      this.putShip()
    }
  }

  //and places 5 single length ships.
  putShip(){
    var newBoard = this.state.board;
    var x = Math.floor(Math.random() * 10);
    var y = Math.floor(Math.random() * 10);
    //allows for both vertical and horizontal ships on the board
    var ranNum = Math.floor(Math.random() * 2)
    if(newBoard[x][y] === 1){
      console.log("put reset");
      this.putShip()
    } else{
        console.log("attempt to put a ship");
        if (ranNum === 1){
          newBoard = this.putHoriz(x, y, newBoard);
        } else {
          newBoard = this.putVertical(x, y, newBoard);
        }
      this.setState({board: newBoard});
    }
  }

  //places ship horizontally, without breaking the board
  putHoriz(x, y, newBoard){
    let placeShip = true;
    if (x > 5) {
      x -= 6
    }
    for (let i = 0; i < 3; i++ ) {
      // newBoard[x + i][y] = SHIP;
      if (newBoard[x + i][y] === SHIP) {
        console.log("horiz reset");
        placeShip = false;
        this.putShip();
      }
    }
    if (placeShip){
      console.log("put a horiz ship");
      for (let i = 0; i < 3; i++ ) {
        newBoard[x + i][y] = SHIP;
      }
    }
    return newBoard;
  }
//places ship vertically, without breaking the board
  putVertical(x, y, newBoard){
    let placeShip = true
    if (y > 5) {
      y -= 6
    }
    for (let i = 0; i < 3; i++ ) {
      // newBoard[x + i][y] = SHIP;
      if (newBoard[x][y + i] === SHIP) {
        console.log("vert reset");
        placeShip = false;
        this.putShip();
      }
    }
    if (placeShip){
      console.log("put a vert ship");
      for (let i = 0; i < 3; i++ ) {
        newBoard[x][y + i] = SHIP;
      }
    }
    return newBoard;
  }





  // renderState(){
  //   this.getBoard();
  //   this.getPos();
  //   this.putShip();
  // }

  render() {
    return (
      <div>
        <table>
          <tbody>
            { this.renderRows() }
          </tbody>
        </table>
        <h1 className = "msg">{this.state.message}</h1>
        <span className = "shotCount">{this.state.shots}</span> shots left
      </div>
    );
  }
}

export default Board;
