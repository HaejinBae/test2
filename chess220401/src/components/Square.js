import React,{ Component } from "react";

export default class Square extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <button className="square" 
                onClick={()=>this.props.f([this.props.value,this.props.pos,this.props.camp,this.props.piece])}>
                    {this.props.value}</button>
        );
    }
}

Square.defaultProps ={
    piece: '',
    camp:'',
    value: ''
};