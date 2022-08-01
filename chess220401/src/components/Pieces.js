import React,{Component} from "react";

export default class Pieces extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="pieces">
                <p>PROMOTION</p>
                <button id="rook">{this.props.next=='black'?'♜':'♖'}</button>
                <button id="knight">{this.props.next=='black'?'♞':'♘'}</button>
                <button id="bishop">{this.props.next=='black'?'♝':'♗'}</button>
                <button id="queen">{this.props.next=='black'?'♛':'♕'}</button>
            </div>
        );
    }
}


// function Pieces(props){
//     return(
//         <button className="square" onClick={props.onClick}>
//             {props.value}
//         </button>
//     );
// }

// export default Pieces;