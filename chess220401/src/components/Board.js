import React from "react";
import Square from "./Square";
import './style.css';

export default class Board extends React.Component{
    constructor(props){
        super(props);
        // console.log(props.select);
    }

    renderSquares(){
        // let row=[];
        // for(let j=0;j<8;j++){
        //     let col = [];
        //     for(let i=0;i<8;i++){
        //         if(j==1||j==6){
        //             if(j==1){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♟'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♙'></Square>
        //                 );
        //             }
        //         }else if((i==0||i==7)&&(j==0||j==7)){
        //             if(j==0){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♜'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♖'></Square>
        //                 );
        //             }
        //         }
        //         else if((i==1||i==6)&&(j==0||j==7)){
        //             if(j==0){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♞'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♘'></Square>
        //                 );
        //             }
        //         }
        //         else if((i==2||i==5)&&(j==0||j==7)){
        //             if(j==0){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♝'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♗'></Square>
        //                 );
        //             }
        //         }
        //         else if((j==0||j==7)&&i==3){
        //             if(j==0){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♛'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♕'></Square>
        //                 );
        //             }
        //         }
        //         else if((j==0||j==7)&&i==4){
        //             if(j==0){
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='black' pos={[j,i]} value='♚'></Square>
        //                     );
        //             }else{
        //                 col.push(
        //                     <Square status='alive' f={this.props.select} camp='white' pos={[j,i]} value='♔'></Square>
        //                 );
        //             }
        //         }
        //         else{
        //             col.push(
        //                 <Square pos={[j,i]} f={this.props.select}></Square>
        //             );
        //         }
        //         // console.log(col[i]);
        //     }
        //     row.push(
        //         <div className="board-row">
        //             {col}
        //         </div>
        //     );
        // }
        let row=[];
        for(let j=0;j<8;j++){
            let col = [];
            for(let i=0;i<8;i++){
                col.push(
                    <Square value={this.props.squares[j][i].value} camp={this.props.squares[j][i].camp} pos={[j,i]} 
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

