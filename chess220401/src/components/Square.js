import React,{ Component } from "react";
import styled from "styled-components";

// const Button = styled.button`
//     background-color: ${props=>props.moveable&&rgb(156, 122, 78)};
// `;


export default class Square extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <button className="square" 
                piece={this.props.piece} camp={this.props.camp} pos={this.props.pos} moveable={this.props.moveable}
                onClick={()=>this.props.f([this.props.value,this.props.pos,this.props.camp,this.props.piece])}>
                    {this.props.value}</button>
        );
    }
}

Square.defaultProps ={
    piece: '',
    camp:'',
    value: '',
    moveable:false
};