import React,{Component} from "react";

export default class Pieces extends Component{
    constructor(props){
        super(props);
    }

    render(){
        var pro = {
            rook: this.props.next=='black'?'♜':'♖',
            knight: this.props.next=='black'?'♞':'♘',
            bishop: this.props.next=='black'?'♝':'♗',
            queen: this.props.next=='black'?'♛':'♕'
        };
        return(
            <div id="pieces">
                <p>PROMOTION</p>
                <button id="rook" onClick={()=>this.props.promotion(pro.rook,'rook')}>
                    {pro.rook}</button>
                <button id="knight" onClick={()=>this.props.promotion(pro.knight,'knight')}>
                    {pro.knight}</button>
                <button id="bishop" onClick={()=>this.props.promotion(pro.bishop,'bishop')}>
                    {pro.bishop}</button>
                <button id="queen" onClick={()=>this.props.promotion(pro.queen,'queen')}>
                    {pro.queen}</button>
            </div>
        );
    }
}