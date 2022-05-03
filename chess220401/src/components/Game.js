import React from "react";
import Board from "./Board";

export default class Game extends React.Component{
    constructor(props){
        super(props);

        let row=[];
        for(let j=0;j<8;j++){
            let col = [];
            for(let i=0;i<8;i++){
                if(j==1||j==6){
                    if(j==1){
                        col.push(
                            {camp:'black', value:'♟'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♙'}
                        );
                    }
                }else if((i==0||i==7)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♜'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♖'}
                        );
                    }
                }
                else if((i==1||i==6)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♞'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♘'}
                        );
                    }
                }
                else if((i==2||i==5)&&(j==0||j==7)){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♝'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♗'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==3){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♛'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♕'}
                        );
                    }
                }
                else if((j==0||j==7)&&i==4){
                    if(j==0){
                        col.push(
                            {camp:'black', value:'♚'}
                            );
                    }else{
                        col.push(
                            {camp:'white', value:'♔'}
                        );
                    }
                }
                else{
                    col.push(
                        {camp:'', value:''}
                    );
                }
                // console.log(col[i]);
            }
            row.push(
                col
            );
        }
        
        // console.log(row);
        

        this.state = {
            // history: [{squares: Array(64).fill(null)}],
            history: [{squares: row}],
            selected:'',
            WIsNext: true
        };
        console.log(this.state.history);
    }

    selectedPiece(p){
        this.setState({
            history: this.state.history,
            selected:p,
            WIsNext: this.state.WIsNext
        });
        console.log(this.state.selected);
    }


    render(){
        const history = this.state.history;
        const current = history[0];

        return(
            <div className="game">
                <div className="game-board">
                    <Board select={(p)=>this.selectedPiece(p)} squares={current.squares}/>
                </div>
                <div className="selected">
                    selected:{this.state.selected[0]}<br/>
                    pos:{this.state.selected[1]}<br/>
                    camp:{this.state.selected[2]}
                </div>
            </div>
        );
    }
}