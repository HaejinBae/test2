import React from "react";
import Square from "./Square";
import './style.css';

export default class Board extends React.Component{
    constructor(props){
        super(props);
        // console.log(props.select);
    }

    renderSquares(){
        let row=[];
        for(let j=0;j<8;j++){
            let col = [];
            for(let i=0;i<8;i++){
                col.push(
                    <Square value={this.props.squares[j][i].value} camp={this.props.squares[j][i].camp} piece={this.props.squares[j][i].piece} pos={[j,i]} 
                        f={this.props.select}></Square>
                );
                // console.log(col[i]);
            }
            row.push(
                <div className="board-row">
                    {col}
                </div>
            );
        }

        return(
            row
        );
    }

    render(){
        return(
            <div id="board">
                {this.renderSquares()}
            </div>
        );
    }
}

