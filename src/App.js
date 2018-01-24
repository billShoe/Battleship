import React, { Component } from 'react';

//CONASTANT VALUES FOR GRID VALUES
const EMPTY = 0
const SHIP = 1
const HIT = 2
const MISS = 3
const SHOWSHIPS = 4
const BOARDSIZE = 10

class Board extends Component {
  constructor(props){
    super(props)
    //Maintain state for the entire game in your main component
    this.state = {
      board: this.getBoard(BOARDSIZE),
      shots: 50,
      message: 'Take the shot!!!'
    }
  }

  //creates a board with however many squares we pass to the function
    getBoard(boardSize) {
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
  renderRow(rowNumber) {
    const { board } = this.state
    let row = []

    for(let iter = 0; iter< 10; iter++) {

      let className;
      //sets css for grid, changes grid color according to value
      switch (board[iter][rowNumber]) {
        case MISS:
          className = 'miss'
          break;
        case HIT:
          className = 'hit'
          break;
        case SHIP:
          className = 'blank'
          break;
        case SHOWSHIPS:
          className = 'ship'
          break;
        default:
          className = 'blank'
      }
      // create single cell with id of coordinates and className
      // 0-0   3-5
      row.push(<td
                  key={iter + '-' +rowNumber}
                  id={iter + '-' +rowNumber}
                  className={className}
                  onClick={this.handleClick.bind(this)}>
                  </td>)
    }
    return row;
  }

//Use a for loop to add a new row to table
  renderRows(){
    let newBoard = []

    for(let iter = 0; iter < 10; iter++) {
      newBoard.push(<tr key={iter}>{this.renderRow(iter)}</tr>)
    }
    return newBoard;
  }

  // On game over replaces all SHIP values with SHOWSHIPS to reveal location
  renderGameOver(board){
    let newBoard = board
    for (let row = 0 ; row < BOARDSIZE; row++) {
      for (let col = 0 ; col < BOARDSIZE; col++) {
        if(newBoard[row][col] === SHIP){
          newBoard[row][col] = SHOWSHIPS;
        }
      }
    }
    return newBoard;
  }


  //Triggers on click then:
  //checks corresponding board value if there is a ships
  //lets user know if its a hit or miss
  //then removes a shot from the shot counter
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
      newMessage = this.checkWin(newBoard, MISS);
    } else if (newBoard[x][y] === 1) {
      newBoard[x][y] = HIT;
      newShots--;
      newMessage = this.checkWin(newBoard, HIT)
    }
    if (newShots < 0) {
      newMessage = "YOU LOSE"
      newShots = 0
      newBoard = this.renderGameOver(newBoard)
    }
    this.setState({
      board: newBoard,
      shots: newShots,
      message: newMessage,
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
      if (x + shipSize > BOARDSIZE) {
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

      if (y + shipSize > BOARDSIZE) {
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
      for (let row = 0 ; row < BOARDSIZE; row++) {
        console.log("asdf");
        for (let col = 0 ; col < BOARDSIZE; col++) {
          if(newBoard[row][col] === HIT){
            console.log();
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
