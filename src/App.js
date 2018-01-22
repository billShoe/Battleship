import React, { Component } from 'react';

class Board extends Component {
  constructor(props){
    super(props)
    //Maintain state for the entire game in your main component
    this.state = {
      board: this.getBoard(),
      SHIP: 1,
    }
    for(let i = 0;i < 5; i++){
      this.putShip()
    }
  }

  //loop create another for loop to create the <td> tags
  renderRow(rowNumber){
    let row = [];
    for(let i = 0;i < 10; i++){
      // create single cell with id of coordinates
      // 0-0   3-5
      row.push(<td id={i + '-' +rowNumber}></td>);
    }
    return row;
  }
//Use a for loop to append to a table a <tr> tag
  renderRows(){
    let newBoard = []
    for(let i = 0; i < 10; i++) {
      newBoard.push(<tr>{this.renderRow(i)}</tr>)
    }
    return newBoard;
  }

  //and places 5 single length ships.
  putShip(){
    let newBoard = this.state.board;
    let a = Math.floor(Math.random() * 10);
    let b = Math.floor(Math.random() * 10);
    if(newBoard[a][b] === 1){
      this.putShip()
    } else{
      newBoard[a][b] = this.state.SHIP
      this.setState({board: newBoard});
    }
    console.log(newBoard);
  }

  getBoard() {
    let newBoard = []
    for (let i = 0 ; i < 10 ; i++) {
      newBoard.push([0,0,0,0,0,0,0,0,0,0])
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
      <table>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }
}

export default Board;
