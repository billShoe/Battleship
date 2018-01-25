import React, { Component } from 'react';

import Square from './Square'

//CONASTANT VALUES FOR GRID VALUES
export const EMPTY = 0
export const SHIP = 1
export const HIT = 2
export const MISS = 3
export const SHOWSHIPS = 4

class Board extends Component {
  constructor(props){
    super(props)

    const { boardSize, maxShots } = this.props

    //Maintain state for the entire game in your main component
    this.state = {
      board: this.getBoard(boardSize),
      shots: maxShots,
      message: 'Take the shot!!!'
    }
  }

  //creates a board with however many squares we pass to the function
    getBoard(boardSize) {
      console.log(boardSize);
      let board = []
      //Create an array of arrays
      for (let row = 0 ; row < boardSize; row++) {
        board[row] = []
        for (let col = 0 ; col < boardSize; col++) {
          board[row][col] = EMPTY
        }
      }
      return board;
    }

  //loop create another for loop to create the <td> tags
  renderRow(row) {
    const { board } = this.state
    let cells = []

    for(let col = 0; col < this.props.boardSize; col++) {
      cells.push(<Square
                  key={`${row}_${col}`}
                  status={board[row][col]}
                  onClick={this.handleClick.bind(this, row, col)} />)
    }

    return cells;
  }

//Use a for loop to add a new row to table
  renderRows(){
    let newBoard = []

    for(let iter = 0; iter < this.props.boardSize; iter++) {
      newBoard.push(<tr key={iter}>{this.renderRow(iter)}</tr>)
    }
    return newBoard;
  }

  // On game over replaces all SHIP values with SHOWSHIPS to reveal location
  renderGameOver(board) {
    const { boardSize } = this.props

    for (let row = 0 ; row < boardSize; row++) {
      for (let col = 0 ; col < boardSize; col++) {
        if(board[row][col] === SHIP){
          board[row][col] = SHOWSHIPS
        }
      }
    }

    return board;
  }

  //Triggers on click then:
  //checks corresponding board value if there is a ships
  //lets user know if its a hit or miss
  //then removes a shot from the shot counter
  handleClick(row, col) {
    let { board, shots, msg } = this.state

    if (shots < 0) {
      msg = "YOU LOSE"
      shots = 0
      board = this.renderGameOver(board)
    }

    if (board[row][col] === 0) {
      board[row][col] = MISS;
      shots--;
      msg = this.checkWin(board, MISS);
    } else if (board[row][col] === 1) {
      board[row][col] = HIT;
      shots--;
      msg = this.checkWin(board, HIT)
    }

    this.setState({
      board: board,
      shots: shots,
      message: msg,
    })
  }

  // starts each game with 5 randomly placed ships
  componentWillMount(){
    // can I refactor this to a .map()?
    let shipList = [2,3,3,4,5]
    for (let iter = 0 ; iter < 5 ; iter++) {
      this.putShip(shipList[iter])
    }
  }

  //gets a random coordinate on the grid
  getPos(){
    var x = Math.floor(Math.random() * 10);     // random number between 0 - 9
    var y = Math.floor(Math.random() * 10);
    return([x, y])
  }

  // places a ship on a random valid coordinate
  // chooses between horizontal or vertical placement randomly
  putShip(shipSize){
    var newBoard = this.state.board;
    var ranNum = Math.floor(Math.random() * 2)  // 1 for horizontal
    // console.log("---putShip called      1 ---");
    // if(newBoard[x][y] === 1) {
    //   this.putShip()
    // } else {
      if (ranNum === 1) {
        this.setState({board: this.putHoriz(newBoard, shipSize)})
      } else {
        this.setState({board: this.putVertical(newBoard, shipSize)})
      }
    // }
  }

  // places ship horizontally
  // restarts puShip() if it will overlap any existing ships,
  putHoriz(newBoard, shipSize){
    let findPlace = true;
    //ship is always placed in bounds of the board
    // console.log("HORIZ ATTEMPT          2 ");
    while (findPlace){  //While true, will get random position
      var pos = this.getPos()
      var x = pos[0]
      var y = pos[1]
      let placeShip = 0;

      //keeps ships placed within board
      if (x + shipSize > this.props.boardSize) {
        x -= shipSize
      }
      // Checks if the ship will overlap an existing ship
      for (let iter = 0; iter < shipSize; iter++ ) {
        // Adds 1 to placeShip is space is valid
        if (newBoard[x + iter][y] === EMPTY) {
          placeShip++;
        }
      }
      // Will only place a ship when valid number of spaces is equal to the length of the ship being placed.
      if (placeShip === shipSize){
        for (let iter = 0; iter < shipSize; iter++ ) {
          // console.log("####SHIP PLACED####   3  ||", (x + iter), y);
          newBoard[x + iter][y] = SHIP;
        }
        findPlace = false
        // console.log(newBoard);
        return newBoard;
      }
    }
  }

  // places ship vertically
  // Same idea of horizontal, but iterates through y instead of x
  putVertical(newBoard, shipSize) {
    let findPlace = true;
    //ship is always placed in bounds of the board
    // console.log("VERT  ATTEMPT          2 ");
    while (findPlace){
      var pos = this.getPos()
      var x = pos[0]
      var y = pos[1]
      let placeShip = 0;

      if (y + shipSize > this.props.boardSize) {
        y -= shipSize
      }
      for (let iter = 0; iter < shipSize; iter++ ) {
        if (newBoard[x][y + iter] === EMPTY) {
          placeShip++;
        }
      }
      if (placeShip === shipSize){
        for (let iter = 0; iter < shipSize; iter++ ) {
          // console.log("$$$$SHIP PLACED$$$$   3  ||", x, (y + iter));
          newBoard[x][y + iter] = SHIP;
        }
        findPlace = false
        return newBoard;
      }
    }
  }
//checks if the user has hit all ships
  checkWin(newBoard, hitOrMiss) {
    var totalHit = 0;
    if(hitOrMiss === HIT){
      for (let row = 0 ; row < this.props.boardSize; row++) {
        for (let col = 0 ; col < this.props.boardSize; col++) {
          if(newBoard[row][col] === HIT){
            totalHit++;
          }
        }
      }
      // Check if all ships have been hit, ends game on win
      if(totalHit === 17){
        if(!alert('YOU WIN :D')){window.location.reload();}
        return ("YOU SUNK MY BATTLESHIP!")
      } else {
        return ("Hit part of a ship, keep going! ")
      }
    } else {
      return("You missed!")
    }
  }

  newGame(e) {
    e.preventDefault();
    window.location.reload();
  }

  render() {
    return (
      <div>
        <div className = "table">
          <table>
            <tbody>
              { this.renderRows() }
            </tbody>
          </table>
        </div>
        <h1 className="msg">{this.state.message}</h1>
        <span className="shotCount">{this.state.shots}</span> shots left
        <button onClick={this.newGame} >New game!</button>
      </div>
    );
  }
}

export default Board;
