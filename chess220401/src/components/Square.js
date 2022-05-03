import React,{ Component } from "react";
import { useState } from "react";
// export default function Square(props){


//     // console.log(props.pos);
//     // if(props.pos[0]==1||props.pos[1]==6){
//     //     Square.defaultProps.value='♙';
//     // }
//     // else if((props.pos[1]==0||props.pos[1]==7)&&(props.pos[0]==0||props.pos[0]==7)){
//     //     Square.defaultProps.value='♖';
//     // }
//     // else if((props.pos[1]==1||props.pos[1]==6)&&(props.pos[0]==0||props.pos[0]==7)){
//     //     Square.defaultProps.value='♘';
//     // }
//     // else if((props.pos[1]==2||props.pos[1]==5)&&(props.pos[0]==0||props.pos[0]==7)){
//     //     Square.defaultProps.value='♗';
//     // }
//     // else if((props.pos[0]==0||props.pos[0]==7)&&props.pos[1]==3){
//     //     Square.defaultProps.value='♕';
//     // }
//     // else if((props.pos[0]==0||props.pos[0]==7)&&props.pos[1]==4){
//     //     Square.defaultProps.value='♔';
//     // }
//     // else{
//     //     Square.defaultProps.value='';
//     // }


//     return(
//         <button className="square" 
//             status={props.status} pos={props.pos}>{props.value}</button>
//     );
// }

// Square.defaultProps ={
//     status: 'alive',
//     value: ''
// };
export default class Square extends Component{
    constructor(props){
        super(props);
        
        // this.state ={
        //     status: '',
        //     camp:'',
        //     pos: [],
        //     value: ''
        // };
        // console.log(props);
    }


    // console.log(props.pos);
    // if(props.pos[0]==1||props.pos[1]==6){
    //     Square.defaultProps.value='♙';
    // }
    // else if((props.pos[1]==0||props.pos[1]==7)&&(props.pos[0]==0||props.pos[0]==7)){
    //     Square.defaultProps.value='♖';
    // }
    // else if((props.pos[1]==1||props.pos[1]==6)&&(props.pos[0]==0||props.pos[0]==7)){
    //     Square.defaultProps.value='♘';
    // }
    // else if((props.pos[1]==2||props.pos[1]==5)&&(props.pos[0]==0||props.pos[0]==7)){
    //     Square.defaultProps.value='♗';
    // }
    // else if((props.pos[0]==0||props.pos[0]==7)&&props.pos[1]==3){
    //     Square.defaultProps.value='♕';
    // }
    // else if((props.pos[0]==0||props.pos[0]==7)&&props.pos[1]==4){
    //     Square.defaultProps.value='♔';
    // }
    // else{
    //     Square.defaultProps.value='';
    // }


    selected(p){
        this.props.f(p);
        // console.log(this.props.f);
    }
    render(){
        return(
            <button className="square" 
                status={this.props.status} camp={this.props.camp} pos={this.props.pos} 
                onClick={()=>this.selected([this.props.value,this.props.pos,this.props.camp])}>
                    {this.props.value}</button>
        );
    }
}

Square.defaultProps ={
    status: 'alive',
    camp:'',
    value: ''
};